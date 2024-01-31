import { formatDateTimeShort } from "@/utils/formatters"
import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/todos", { params: { page } })

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
      result: todos,
      meta: { count },
    },
    refetch,
  } = useQuery({
    queryKey: ["todos", page],
    queryFn: () => apiClient("/todos", { params: { page } }),
    initialData,
    enabled: false,
  })
  const { mutateAsync: deleteTodo } = useMutation({
    mutationFn: (todoId) => apiClient.delete(`/todos/${todoId}`),
  })
  const handleClickDelete = async (id) => {
    // Const todoId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    await deleteTodo(id)
    await refetch()
  }

  return (
    <div className="relative">
      {isFetching && <Loader />}
      
      <div className="mb-4 text-xl font-semibold">
        Total Todos: {count}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {todos.map(({ id, description, createdAt }) => (
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

