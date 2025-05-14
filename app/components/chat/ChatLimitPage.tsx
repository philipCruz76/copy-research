export function ChatLimitPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">
        You have reached the maximum number of chats
      </h1>
      <p className="text-sm text-gray-500">
        Please delete some the exisitng conversations if you wish to create a
        new one
      </p>
    </div>
  );
}
