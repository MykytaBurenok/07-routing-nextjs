interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function FilterPage({ params }: Props) {
  const { slug } = await params;

  const tag = slug[0];

  return <div>Selected tag: {tag}</div>;
}
