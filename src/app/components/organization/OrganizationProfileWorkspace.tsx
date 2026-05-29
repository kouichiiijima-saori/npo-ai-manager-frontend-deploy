export function OrganizationProfileWorkspace() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-neutral-100">
                    団体基本情報管理
                </h1>
                <p className="mt-2 text-sm text-neutral-400">
                    AI判定で参照するNPO法人の基本情報を登録・管理します。
                </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <h2 className="text-lg font-semibold text-neutral-100">
                    団体プロフィール
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                    法人名、活動地域、ミッションなどは助成金との適合判定に利用されます。
                </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">
                            法人名
                        </label>
                        <input
                            type="text"
                            placeholder="例：NPO法人サンプル"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">
                            法人種類
                        </label>
                        <input
                            type="text"
                            placeholder="例：特定非営利活動法人"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">
                            所在地
                        </label>
                        <input
                            type="text"
                            placeholder="例：埼玉県比企郡鳩山町"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">
                            代表者名
                        </label>
                        <input
                            type="text"
                            placeholder="例：田中 太郎"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="establishedAt" className="mb-2 block text-sm font-medium text-neutral-300">
                            設立年月日
                        </label>
                        <input
                            id="establishedAt"
                            type="date"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-300">
                            活動地域
                        </label>
                        <input
                            type="text"
                            placeholder="例：鳩山町、東松山市、坂戸市"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-neutral-300">
                            ミッション
                        </label>
                        <textarea
                            rows={3}
                            placeholder="団体が解決したい社会課題や活動目的を入力してください。"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-neutral-300">
                            団体概要
                        </label>
                        <textarea
                            rows={5}
                            placeholder="団体の活動内容、対象者、地域での役割などを入力してください。"
                            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        保存する
                    </button>
                </div>
            </div>
        </div>
    );
}