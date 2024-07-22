import Conversation from '@/components/Conversation';

export default function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  return <Conversation params={params} />;
}
