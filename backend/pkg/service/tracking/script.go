package tracking

import (
	"bytes"
	"context"
	_ "embed"
	"text/template"

	"github.com/go-errors/errors"
)

type ScriptData struct {
	RESTApiBaseURL string
}

func (s *service) GetScript(ctx context.Context) ([]byte, error) {
	if trackingScript == nil {
		t := template.Must(template.New("tracker-script").Parse(trackerScriptTemplate))

		var b bytes.Buffer
		err := t.Execute(&b, ScriptData{
			RESTApiBaseURL: s.envService.RESTApiURL(""),
		})
		if err != nil {
			return nil, errors.Wrap(err, 0)
		}

		if !s.envService.Debug() {
			trackingScript, err = s.minify.Bytes("text/javascript", b.Bytes())
			if err != nil {
				return nil, errors.Wrap(err, 0)
			}
		} else {
			trackingScript = b.Bytes()
		}
	}

	return trackingScript, nil
}

var trackingScript []byte

//go:embed files/tracker-script.js
var trackerScriptTemplate string
