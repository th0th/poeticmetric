import millify from "millify";
import React, { useCallback, useContext, useMemo } from "react";
import { Card, Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { PlansContext } from "../../contexts";
import { ActionButton } from "./ActionButton";
import { plans } from "./plans";

type PlansProps = {
  signUp?: boolean;
};

interface PricingPlan {
  priceMonthly: number;
}

export function Plans({ signUp = false }: PlansProps) {
  const { set, subscriptionPeriod } = useContext(PlansContext);

  const getActionButtonNode = useCallback((plan: Plan) => (signUp ? null : (
    <ActionButton className="mt-auto" plan={plan} />
  )), [signUp]);

  const getPriceNode = useCallback((plan: PricingPlan) => {
    if (subscriptionPeriod === "YEAR") {
      return (
        <div>
          <div>
            <span className="fs-2 fw-bold">{`$${10 * plan.priceMonthly}`}</span>

            <span>/yr</span>
          </div>

          <div className="fs-sm fw-medium text-muted">
            <del>{`$${12 * plan.priceMonthly}`}</del>

            {" paid yearly"}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div>
          <span className="fs-2 fw-bold">{`$${plan.priceMonthly}`}</span>

          <span>/mo</span>
        </div>

        <div className="fs-sm fw-medium text-muted">{" paid monthly"}</div>
      </div>
    );
  }, [subscriptionPeriod]);

  const handleYearlySwitchChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    set((s) => ({ ...s, subscriptionPeriod: event.target.checked ? "YEAR" : "MONTH" }));
  }, [set]);

  const dataOwnershipTooltipNode = useMemo(() => (
    <Tooltip className="fw-medium fs-xs">
      It&apos;s truly your data. We don&apos;t sell or monetize your data in any way. You can export or purge all of it at any time.
    </Tooltip>
  ), []);

  const prioritySupportTooltipNode = useMemo(() => (
    <Tooltip className="fw-medium fs-xs">
      You get e-mail support directly from an engineer when you need.
    </Tooltip>
  ), []);

  return (
    <div>
      <div className="align-items-center d-flex flex-column p-3">
        <Form.Switch
          checked={subscriptionPeriod === "YEAR"}
          className="align-items-center d-flex flex-row gap-2"
          id="plans.period"
          label={(<span className="fs-5 fw-medium">Yearly billing (2 months free)</span>)}
          onChange={handleYearlySwitchChange}
          role="switch"
          type="checkbox"
        />
      </div>

      <Row className="gy-4" lg={3} xs={1}>
        {plans.map((p) => (
          <Col className="flex-grow-1" key={p.name}>
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <h4>{p.name}</h4>

                <div className="fs-sm fw-medium text-muted">{p.description}</div>

                <hr className="mx-n3 mb-2 text-muted" />

                {getPriceNode(p)}

                <ul className="mt-3">
                  <li>
                    <OverlayTrigger overlay={dataOwnershipTooltipNode} placement="bottom" rootClose trigger={["focus", "hover"]}>
                      <a className="border-black border-2 border-bottom border-dotted cursor-pointer text-black text-decoration-none">
                        100% data ownership
                      </a>
                    </OverlayTrigger>
                  </li>

                  <li>Unlimited websites</li>

                  <li>{`${millify(p.maxEventsPerMonth)} monthly page views`}</li>

                  <li>{p.maxUsers === 1 ? "Single account" : `${p.maxUsers} team members`}</li>

                  {p.isPriorityEmailSupportEnabled ? (
                    <li>
                      <OverlayTrigger overlay={prioritySupportTooltipNode} placement="bottom" rootClose trigger={["focus", "hover"]}>
                        <a className="border-black border-2 border-bottom border-dotted cursor-pointer text-black text-decoration-none">
                          Priority support
                        </a>
                      </OverlayTrigger>
                    </li>
                  ) : null}
                </ul>

                {getActionButtonNode(p)}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mt-3">
        <Card.Body>
          <div className="text-center">
            {"If you need a plan with "}
            <strong>more events</strong>
            {" or "}
            <strong>team members</strong>
            {", "}
            <a href="mailto:support@poeticmetric.com?subject=Custom%20pricing%20plan">
              reach out to us
            </a>
            {" so we can tailor a plan for your needs."}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
