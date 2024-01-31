import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/categories", { params: { page } })

  return {
    props: { initialData: data },
  }
}
// eslint-disable-next-line max-lines-per-function
const CategoriesPage = ({ initialData }) => {
  const { query } = useRouter()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isFetching,
    data: {
      result: categories,
      meta: { count },
    },
    refetch,
  } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => apiClient("/categories", { params: { page } }),
    initialData,
    enabled: false,
  })
  const { mutateAsync: deleteTodo } = useMutation({
    mutationFn: (categoryId) => apiClient.delete(`/categories/${categoryId}`),
  })
  const handleClickDelete = async (event) => {
    const categoryId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    await deleteTodo(categoryId)
    await refetch()
  }

  return (
    <div className="relative">
      {isFetching && <Loader />}
      <table className="w-full">
        <thead>
          <tr>
            {["#", "Name", "🗑️"].map((label) => (
              <td
                key={label}
                className="p-4 bg-slate-300 text-center font-semibold"
              >
                {label}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map(({ id, name }) => (
            <tr key={id} className="even:bg-slate-100">
              <td className="p-4">{id}</td>
              <td className="p-4">{name}</td>
              <td className="p-4">
                <button data-id={id} onClick={handleClickDelete}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} page={page} className="mt-8" />
    </div>
  )
}

export default CategoriesPage
