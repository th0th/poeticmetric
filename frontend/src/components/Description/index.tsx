export type DescriptionProps = {
  children: string;
};

export default function Description({ children }: DescriptionProps) {
  return (
    <>
      <meta content={children} name="description" />
    </>
  );
}
