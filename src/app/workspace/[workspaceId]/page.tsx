type WorkspaceIdPageProps = {
  params: Promise<{ workspaceId: string }>;
};

const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const { workspaceId } = await params;
  return <div>ID: {workspaceId}</div>;
};

export default WorkspaceIdPage;
