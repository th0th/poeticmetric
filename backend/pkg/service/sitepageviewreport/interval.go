package sitepageviewreport

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"strconv"
	"time"
)

type IntervalUnit string

type Interval struct {
	Factor int64        `json:"factor"`
	Unit   IntervalUnit `json:"unit"`
}

const (
	IntervalUnitDay    IntervalUnit = "day"
	IntervalUnitHour   IntervalUnit = "hour"
	IntervalUnitMinute IntervalUnit = "minute"
)

func getInterval(filters *sitereportfilters.Filters) *Interval {
	timeWindowInterval := &Interval{
		Factor: 10,
		Unit:   "minute",
	}

	timeDiff := filters.End.Sub(filters.Start)

	if timeDiff > 180*24*time.Hour {
		timeWindowInterval.Factor = 7
		timeWindowInterval.Unit = "day"
	} else if timeDiff > 7*24*time.Hour {
		timeWindowInterval.Factor = 1
		timeWindowInterval.Unit = "day"
	} else if timeDiff > 24*time.Hour {
		timeWindowInterval.Factor = 1
		timeWindowInterval.Unit = "hour"
	}

	return timeWindowInterval
}

func (i *Interval) ToDuration() time.Duration {
	switch i.Unit {
	case IntervalUnitDay:
		return time.Duration(i.Factor) * 24 * time.Hour
	case IntervalUnitHour:
		return time.Duration(i.Factor) * time.Hour
	case IntervalUnitMinute:
		return time.Duration(i.Factor) * time.Minute
	default:
		panic("invalid factor")
	}
}

func (i *Interval) ToQuery() string {
	return "interval " + strconv.Itoa(int(i.Factor)) + " " + string(i.Unit)
}
