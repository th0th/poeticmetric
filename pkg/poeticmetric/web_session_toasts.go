package poeticmetric

const (
	WebSessionToastVariantDanger  WebSessionToastVariant = "danger"
	WebSessionToastVariantSuccess WebSessionToastVariant = "success"
)

type WebSessionToast struct {
	Message string
	Variant WebSessionToastVariant
}

type WebSessionToastVariant string
