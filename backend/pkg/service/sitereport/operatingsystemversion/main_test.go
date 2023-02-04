package operatingsystemversion

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

	operatingSystemName := "macOS"

	events := []*model.Event{}

	testData := []struct {
		OperatingSystemVersion *string
		VisitorCount           int
	}{
		{OperatingSystemVersion: nil, VisitorCount: 237},
		{OperatingSystemVersion: pointer.Get("20"), VisitorCount: 363},
		{OperatingSystemVersion: pointer.Get("19"), VisitorCount: 338},
		{OperatingSystemVersion: pointer.Get("18"), VisitorCount: 319},
		{OperatingSystemVersion: pointer.Get("17"), VisitorCount: 230},
		{OperatingSystemVersion: pointer.Get("16"), VisitorCount: 196},
		{OperatingSystemVersion: pointer.Get("15"), VisitorCount: 189},
		{OperatingSystemVersion: pointer.Get("14"), VisitorCount: 139},
		{OperatingSystemVersion: pointer.Get("13"), VisitorCount: 85},
		{OperatingSystemVersion: pointer.Get("12"), VisitorCount: 60},
		{OperatingSystemVersion: pointer.Get("11"), VisitorCount: 45},
		{OperatingSystemVersion: pointer.Get("10"), VisitorCount: 36},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:               gofakeit.DateRange(start, end),
				Id:                     uuid.NewString(),
				OperatingSystemName:    &operatingSystemName,
				OperatingSystemVersion: d.OperatingSystemVersion,
				SiteId:                 modelSite.Id,
				VisitorId:              uuid.NewString(),
			})
		}
	}

	err = dp.ClickHouse().
		Create(&events).
		Error
	assert.NoError(t, err)

	report, err := Get(dp, &filter.Filters{
		End:                 end,
		OperatingSystemName: &operatingSystemName,
		SiteId:              modelSite.Id,
		Start:               start,
	}, nil)
	assert.NoError(t, err)

	expectedReport := &Report{
		Data: []*Datum{
			{OperatingSystemName: "macOS", OperatingSystemVersion: "20", VisitorCount: 363, VisitorPercentage: 18},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "19", VisitorCount: 338, VisitorPercentage: 17},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "18", VisitorCount: 319, VisitorPercentage: 16},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "17", VisitorCount: 230, VisitorPercentage: 12},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "16", VisitorCount: 196, VisitorPercentage: 10},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "15", VisitorCount: 189, VisitorPercentage: 9},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "14", VisitorCount: 139, VisitorPercentage: 7},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "13", VisitorCount: 85, VisitorPercentage: 4},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "12", VisitorCount: 60, VisitorPercentage: 3},
			{OperatingSystemName: "macOS", OperatingSystemVersion: "11", VisitorCount: 45, VisitorPercentage: 2},
		},
		PaginationCursor: &PaginationCursor{OperatingSystemVersion: "11", VisitorCount: 45},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
