package main

import (
	"flag"
	"fmt"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
)

var organizations = []*model.Organization{
	{
		Id:     1,
		Name:   "PoeticMetric",
		PlanId: pointer.Get(uint64(3)),
	},
}

var plans = []*model.Plan{
	{
		Id:                1,
		MaxEventsPerMonth: pointer.Get(uint64(100000)),
		MaxUsers:          pointer.Get(uint64(1)),
		Name:              "Basic",
		StripeProductId:   pointer.Get("prod_KXK6a9Zmy3qcLz"),
	},
	{
		Id:                2,
		MaxEventsPerMonth: pointer.Get(uint64(1000000)),
		MaxUsers:          pointer.Get(uint64(3)),
		Name:              "Pro",
		StripeProductId:   pointer.Get("prod_KXK7HFnQGBmP6D"),
	},
	{
		Id:                3,
		MaxEventsPerMonth: pointer.Get(uint64(5000000)),
		MaxUsers:          pointer.Get(uint64(50)),
		Name:              "Business",
		StripeProductId:   pointer.Get("prod_KXK83fu8EQrKfM"),
	},
}

var sites = []*model.Site{
	{
		Domain:         "dev.poeticmetric.com",
		Id:             1,
		Name:           "PoeticMetric DEV",
		OrganizationId: organizations[0].Id,
	},
}

var users = []*model.User{
	{
		Email:               "gokhan@poeticmetric.com",
		Id:                  1,
		IsEmailVerified:     true,
		IsOrganizationOwner: true,
		Name:                "Gokhan",
		OrganizationId:      organizations[0].Id,
		Password:            "$2a$10$ufcHVVBZveNWbqCB.7XrKeBB2uXXs7F4.ugz3OBK33lV0zntj954S",
	},
}

func main() {
	var err error

	flagClear := flag.Bool("clear", false, "Delete all data before inserting.")
	flagEvents := flag.Bool("events", false, "Seed events.")

	flag.Parse()

	dp := depot.New()

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		var err2 error

		if *flagClear {
			fmt.Print("🧼 Deleting existing data from Postgres...")

			err2 = dp2.Postgres().
				Where("1 = 1").
				Delete(&model.Plan{}).
				Error
			if err2 != nil {
				return err2
			}

			fmt.Println(" ✅")

			fmt.Print("🧼 Deleting existing data from Clickhouse...")

			err2 = clearEvents(dp)
			if err2 != nil {
				return err2
			}

			fmt.Println(" ✅")
		}

		fmt.Print("➕ Adding new data to Postgres...")

		err2 = dp2.Postgres().Create(plans).Error
		if err2 != nil {
			return err2
		}

		err2 = dp2.Postgres().Create(organizations).Error
		if err2 != nil {
			return err2
		}

		err2 = dp2.Postgres().Create(users).Error
		if err2 != nil {
			return err2
		}

		err2 = dp2.Postgres().Create(sites).Error
		if err2 != nil {
			return err2
		}

		fmt.Println(" ✅")

		err2 = postgresFixSequences(dp2)
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		panic(err)
	}

	if *flagEvents {
		err = seedEvents(dp, sites[0])
		if err != nil {
			panic(err)
		}
	}
}

func postgresFixSequences(dp *depot.Depot) error {
	fmt.Print("🔑 Fixing sequence information on Postgres...")

	var sequenceFixingQueries []string

	err := dp.Postgres().Raw(`
			SELECT 'SELECT SETVAL('||
				   "quote_literal"("quote_ident"("PGT"."schemaname") || '.' || "quote_ident"("S"."relname")) ||
				   ', COALESCE(MAX(' || "quote_ident"("C"."attname")|| '), 1) ) FROM ' ||
				   "quote_ident"("PGT"."schemaname")|| '.'||"quote_ident"("T"."relname")|| ';'
			FROM "pg_class" AS "S",
				 "pg_depend" AS "D",
				 "pg_class" AS "T",
				 "pg_attribute" AS "C",
				 "pg_tables" AS "PGT"
			WHERE "S"."relkind" = 'S'
				AND "S"."oid" = "D"."objid"
				AND "D"."refobjid" = "T"."oid"
				AND "D"."refobjid" = "C"."attrelid"
				AND "D"."refobjsubid" = "C"."attnum"
				AND "T"."relname" = "PGT"."tablename"
			ORDER BY "S"."relname";
		`).
		Scan(&sequenceFixingQueries).
		Error
	if err != nil {
		return err
	}

	for _, sequenceFixingQuery := range sequenceFixingQueries {
		err = dp.Postgres().
			Exec(sequenceFixingQuery).
			Error
		if err != nil {
			return err
		}
	}

	fmt.Println(" ✅")

	return nil
}
