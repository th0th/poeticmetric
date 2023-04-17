package utils

import "math"

type calculatePercentageChangeArg interface {
	~float64 | ~uint64
}

func CalculatePercentageChange[T calculatePercentageChangeArg](oldValue T, newValue T) (percentageChange int16) {
	oldValue2 := float64(oldValue)
	newValue2 := float64(newValue)

	if oldValue2 == 0 {
		if newValue2 == 0 {
			return 0
		}

		return 100
	}

	diff := newValue2 - oldValue2
	percentageChange = int16(math.Round((diff / oldValue2) * 100))

	return
}
