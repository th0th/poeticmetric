package operatingsystemname

import (
	"os"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/th0th/poeticmetric/backend/pkg/testhelper"
)

var (
	dp *depot.Depot
)

func TestGet(t *testing.T) {
	modelSite := h.Site(dp, nil)

	start, err := time.Parse("2006-01-02", "2022-01-01")
	assert.NoError(t, err)

	end, err := time.Parse("2006-01-02", "2022-12-31")
	assert.NoError(t, err)

	events := []*model.Event{}

	testData := []struct {
		OperatingSystemName *string
		VisitorCount        int
	}{
		{OperatingSystemName: nil, VisitorCount: 237},
		{OperatingSystemName: pointer.Get("OS#1"), VisitorCount: 271},
		{OperatingSystemName: pointer.Get("OS#2"), VisitorCount: 271},
		{OperatingSystemName: pointer.Get("OS#3"), VisitorCount: 244},
		{OperatingSystemName: pointer.Get("OS#4"), VisitorCount: 228},
		{OperatingSystemName: pointer.Get("OS#5"), VisitorCount: 216},
		{OperatingSystemName: pointer.Get("OS#6"), VisitorCount: 212},
		{OperatingSystemName: pointer.Get("OS#7"), VisitorCount: 207},
		{OperatingSystemName: pointer.Get("OS#8"), VisitorCount: 157},
		{OperatingSystemName: pointer.Get("OS#9"), VisitorCount: 108},
		{OperatingSystemName: pointer.Get("OS#10"), VisitorCount: 60},
		{OperatingSystemName: pointer.Get("OS#11"), VisitorCount: 26},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:            gofakeit.DateRange(start, end),
				Id:                  uuid.NewString(),
				OperatingSystemName: d.OperatingSystemName,
				SiteId:              modelSite.Id,
				VisitorId:           uuid.NewString(),
			})
		}
	}

	err = dp.ClickHouse().
		Create(&events).
		Error
	assert.NoError(t, err)

	report, err := Get(dp, &filter.Filters{
		End:    end,
		SiteId: modelSite.Id,
		Start:  start,
	}, nil)
	assert.NoError(t, err)

	expectedReport := &Report{
		Data: []*Datum{
			{OperatingSystemName: "OS#1", VisitorCount: 271, VisitorPercentage: 14},
			{OperatingSystemName: "OS#2", VisitorCount: 271, VisitorPercentage: 14},
			{OperatingSystemName: "OS#3", VisitorCount: 244, VisitorPercentage: 12},
			{OperatingSystemName: "OS#4", VisitorCount: 228, VisitorPercentage: 11},
			{OperatingSystemName: "OS#5", VisitorCount: 216, VisitorPercentage: 11},
			{OperatingSystemName: "OS#6", VisitorCount: 212, VisitorPercentage: 11},
			{OperatingSystemName: "OS#7", VisitorCount: 207, VisitorPercentage: 10},
			{OperatingSystemName: "OS#8", VisitorCount: 157, VisitorPercentage: 8},
			{OperatingSystemName: "OS#9", VisitorCount: 108, VisitorPercentage: 5},
			{OperatingSystemName: "OS#10", VisitorCount: 60, VisitorPercentage: 3},
		},
		PaginationCursor: &PaginationCursor{OperatingSystemName: "OS#10", VisitorCount: 60},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
