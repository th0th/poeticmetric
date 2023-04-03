package export

import (
	"archive/zip"
	"bytes"
	"fmt"

	"github.com/gocarina/gocsv"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
)

func Events(dp *depot.Depot, filters *filter.Filters) (*string, *bytes.Buffer, error) {
	result := &bytes.Buffer{}
	zipFolder := fmt.Sprintf("PoeticMetric export (events) %s - %s", filters.Start.Format("2006-01-02"), filters.End.Format("2006-01-02"))
	zipWriter := zip.NewWriter(result)

	baseQuery := filter.Apply(dp, filters)

	eventsData := []*model.Event{}

	err := baseQuery.
		Session(&gorm.Session{}).
		Find(&eventsData).
		Error
	if err != nil {
		return nil, nil, err
	}

	eventsCsv, err := zipWriter.Create(fmt.Sprintf("%s/events.csv", zipFolder))
	if err != nil {
		return nil, nil, err
	}

	err = gocsv.Marshal(eventsData, eventsCsv)
	if err != nil {
		return nil, nil, err
	}

	err = zipWriter.Close()
	if err != nil {
		return nil, nil, err
	}

	return &zipFolder, result, nil
}
