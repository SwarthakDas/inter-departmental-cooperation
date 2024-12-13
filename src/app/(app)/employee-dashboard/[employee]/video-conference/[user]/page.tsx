import Call from "@/components/Call";

export default async function Page({ params }: { params: Promise<{ user: string }> }) {
    const resolvedParams = await params;
    return (
        <main className="flex w-full flex-col">
            <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
                {resolvedParams.user}
            </p>
            <Call appId={process.env.PUBLIC_AGORA_APP_ID!} channelName={resolvedParams.user}></Call>
        </main>
    )
}