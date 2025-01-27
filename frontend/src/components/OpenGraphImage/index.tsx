export type OpenGraphImageProps = {
  image: {
    height: number;
    url: string;
    width: number;
  };
};

export default function OpenGraphImage({ image }: OpenGraphImageProps) {
  return (
    <>
      <meta content={`${import.meta.env.VITE_FRONTEND_BASE_URL}${image.url}`} property="og:image" />
      <meta content={image.height.toString()} property="og:image:height" />
      <meta content={image.width.toString()} property="og:image:width" />
    </>
  );
}
