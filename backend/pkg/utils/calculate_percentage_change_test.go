package utils

import (
	"testing"
)

func TestCalculatePercentageChangeFloat64(t *testing.T) {
	type args[T calculatePercentageChangeArg] struct {
		oldValue T
		newValue T
	}

	type testCase[T calculatePercentageChangeArg] struct {
		name                 string
		args                 args[T]
		wantPercentageChange int16
	}

	tests := []testCase[float64]{
		{name: "", args: args[float64]{oldValue: 0, newValue: 2.4}, wantPercentageChange: 100},
		{name: "", args: args[float64]{oldValue: 0, newValue: 0}, wantPercentageChange: 0},
		{name: "", args: args[float64]{oldValue: 1.3, newValue: 0}, wantPercentageChange: -100},
		{name: "", args: args[float64]{oldValue: 1.7, newValue: 1.7}, wantPercentageChange: 0},
		{name: "", args: args[float64]{oldValue: 1.6, newValue: 3.2}, wantPercentageChange: 100},
		{name: "", args: args[float64]{oldValue: 3.6, newValue: 5.4}, wantPercentageChange: 50},
		{name: "", args: args[float64]{oldValue: 3.6, newValue: 1.8}, wantPercentageChange: -50},
		{name: "", args: args[float64]{oldValue: 3.2, newValue: 5.3}, wantPercentageChange: 66},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if gotPercentageChange := CalculatePercentageChange(tt.args.oldValue, tt.args.newValue); gotPercentageChange != tt.wantPercentageChange {
				t.Errorf("CalculatePercentageChange() = %v, want %v", gotPercentageChange, tt.wantPercentageChange)
			}
		})
	}
}

func TestCalculatePercentageChangeUint64(t *testing.T) {
	type args[T calculatePercentageChangeArg] struct {
		oldValue T
		newValue T
	}

	type testCase[T calculatePercentageChangeArg] struct {
		name                 string
		args                 args[T]
		wantPercentageChange int16
	}

	tests := []testCase[uint64]{
		{name: "", args: args[uint64]{oldValue: 0, newValue: 100}, wantPercentageChange: 100},
		{name: "", args: args[uint64]{oldValue: 0, newValue: 0}, wantPercentageChange: 0},
		{name: "", args: args[uint64]{oldValue: 1, newValue: 0}, wantPercentageChange: -100},
		{name: "", args: args[uint64]{oldValue: 1, newValue: 1}, wantPercentageChange: 0},
		{name: "", args: args[uint64]{oldValue: 1, newValue: 2}, wantPercentageChange: 100},
		{name: "", args: args[uint64]{oldValue: 2, newValue: 3}, wantPercentageChange: 50},
		{name: "", args: args[uint64]{oldValue: 2, newValue: 1}, wantPercentageChange: -50},
		{name: "", args: args[uint64]{oldValue: 3, newValue: 5}, wantPercentageChange: 67},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if gotPercentageChange := CalculatePercentageChange(tt.args.oldValue, tt.args.newValue); gotPercentageChange != tt.wantPercentageChange {
				t.Errorf("CalculatePercentageChange() = %v, want %v", gotPercentageChange, tt.wantPercentageChange)
			}
		})
	}
}
