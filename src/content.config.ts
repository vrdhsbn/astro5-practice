import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

// ローカルのMarkdownファイルからブログを生成
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
})

// APIからコンテンツを取得
const posts = defineCollection({
  loader: async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json())
    return data.map((entry: Record<string, unknown>) => ({
      // idは文字列である必要がある
      // https://docs.astro.build/en/reference/content-loader-reference/#id
      ...entry,
      id: entry.id?.toString(),
    }))
  },
})

// microCMSからコンテンツを取得
const cms = defineCollection({
  loader: async () => {
    const endpoint = import.meta.env.PUBLIC_CMS_ENDPOINT
    const api_key = import.meta.env.CMS_API_KEY

    const data = await fetch(endpoint, {
      headers: {
        'x-api-key': api_key,
      },
    }).then(res => res.json())
    // microCMSのデータはcontentsプロパティに配列が格納されている
    return data.contents.map((entry: Record<string, unknown>) => ({
      ...entry,
      id: entry.id?.toString(),
    }))
  },
})

export const collections = { blog, posts, cms }
