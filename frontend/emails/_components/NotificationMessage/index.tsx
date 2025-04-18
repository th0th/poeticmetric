import Text from "../Text";

export default function NotificationMessage() {
  return (
    <>
      <Text>Hey,</Text>

      <Text>
        You are receiving this e-mail because this address is set for an alert on
        {" "}
        <span style={{ fontWeight: 700 }}>WebGazer</span>
        . Please see below for the details of the
        incident.
      </Text>

      <Text>You can reply to reach out to support.</Text>
    </>
  );
}
