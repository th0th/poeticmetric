import Breadcrumb from "~/components/Breadcrumb";
import Plans from "~/components/Plans";
import SubscriptionInformation from "~/components/SubscriptionInformation";
import Title from "~/components/Title";

export default function Billing() {
  return (
    <>
      <Title>Billing</Title>

      <div className="container py-16">
        <Breadcrumb>
          <Breadcrumb.Title>Billing</Breadcrumb.Title>
        </Breadcrumb>

        <SubscriptionInformation className="mt-16" />

        <Plans className="mt-16" />
      </div>
    </>
  );
}

export const Component = Billing;
