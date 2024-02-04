import { formatDateTimeShort } from "@/utils/formatters"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/posts", { params: { page } })

  return {
    props: { initialData: data },
  }
}
// eslint-disable-next-line max-lines-per-function
const IndexPage = ({ initialData }) => {
  const { query } = useRouter()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isFetching,
    data: {
      result: posts,
      meta: { count },
    },
    refetch,
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => apiClient("/posts", { params: { page } }),
    initialData,
    enabled: false,
  })
  const { mutateAsync: deletePost } = useMutation({
    mutationFn: (postId) => apiClient.delete(`/posts/${postId}`),
  })
  const handleClickDelete = async (event) => {
    const postId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    await deletePost(postId)
    await refetch()
  }

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(({ id, description, createdAt }) => (
          <div key={id} className="bg-white p-4 rounded-md shadow-md">
            <p className="text-xl font-semibold mb-2">{description}</p>
            <p className="text-gray-500">{`Created At: ${formatDateTimeShort(new Date(createdAt))}`}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => handleClickDelete(id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}
export default IndexPage