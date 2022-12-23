package main

import (
	"bufio"
	"flag"
	"fmt"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/userpassword"
	"os"
)

func main() {
	var err error

	dp := depot.New()

	modelPlan := &model.Plan{
		Name: "Default",
	}

	modelOrganization := &model.Organization{
		PlanId: modelPlan.Id,
	}

	modelUser := &model.User{
		IsEmailVerified:     true,
		IsOrganizationOwner: true,
		OrganizationId:      modelOrganization.Id,
	}

	clear := false
	userPassword := ""
	createDummySite := false

	flag.BoolVar(&clear, "clear", false, "Delete existing data.")
	flag.StringVar(&modelOrganization.Name, "organizationName", "", "Name of the organization.")
	flag.StringVar(&modelUser.Email, "userEmail", "", "User e-mail address.")
	flag.StringVar(&modelUser.Name, "userName", "", "User full name.")
	flag.StringVar(&userPassword, "userPassword", "", "User password.")
	flag.BoolVar(&createDummySite, "createDummySite", false, "Create dummy site.")

	flag.Parse()

	reader := bufio.NewReader(os.Stdin)

	if modelOrganization.Name == "" {
		fmt.Print("enter the organization name: ")
		modelOrganization.Name, err = reader.ReadString('\n')
		if err != nil {
			panic(err)
		}
	}

	if modelUser.Name == "" {
		fmt.Print("enter the user full name: ")
		modelUser.Name, err = reader.ReadString('\n')
		if err != nil {
			panic(err)
		}
	}

	if modelUser.Email == "" {
		fmt.Print("enter the user e-mail address: ")
		modelUser.Email, err = reader.ReadString('\n')
		if err != nil {
			panic(err)
		}
	}

	if userPassword == "" {
		fmt.Print("enter the user password: ")
		userPassword, err = reader.ReadString('\n')
		if err != nil {
			panic(err)
		}
	}

	userPasswordHash, err := userpassword.GetHash(userPassword)
	if err != nil {
		panic(err)
	}

	modelUser.Password = *userPasswordHash

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		var err2 error

		if clear {
			fmt.Print("🧼 Deleting existing data from Postgres...")

			err2 = dp2.Postgres().
				Where("1 = 1").
				Delete(&model.Plan{}).
				Error
			if err2 != nil {
				return err
			}

			fmt.Println(" ✅")

			err2 = postgresFixSequences(dp2)
			if err2 != nil {
				return err
			}
		}

		fmt.Print("➕ Adding new data to Postgres...")

		err2 = dp2.Postgres().
			Create(modelPlan).
			Error
		if err2 != nil {
			return err2
		}

		modelOrganization.PlanId = modelPlan.Id

		err2 = dp2.Postgres().
			Create(modelOrganization).
			Error
		if err2 != nil {
			return err2
		}

		modelUser.OrganizationId = modelOrganization.Id

		err2 = dp2.Postgres().
			Create(modelUser).
			Error
		if err2 != nil {
			return err2
		}

		fmt.Println(" ✅")

		if createDummySite {
			fmt.Print("🏠 Creating site on Postgres...")

			modelSite := &model.Site{
				Domain:         "dev.poeticmetric.com",
				Name:           "PoeticMetric DEV",
				OrganizationId: modelOrganization.Id,
			}

			err2 = dp2.Postgres().
				Create(modelSite).
				Error
			if err2 != nil {
				return err2
			}

			fmt.Println(" ✅")

			fmt.Print("📊 Adding events to ClickHouse...")

			err2 = seedEvents(dp, clear, modelSite)
			if err2 != nil {
				return err2
			}

			fmt.Println(" ✅")
		}

		return nil
	})
	if err != nil {
		panic(err)
	}

	err = postgresFixSequences(dp)
	if err != nil {
		panic(err)
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
