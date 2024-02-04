import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React from "react"

export const getServerSideProps = async ({ query: { page } }) => {
  const data = await apiClient("/comments", { params: { page } })

  return {
    props: { initialData: data },
  }
}
// eslint-disable-next-line max-lines-per-function
const CommentsPage = ({ initialData }) => {
  const { query } = useRouter()
  const page = Number.parseInt(query.page || 1, 10)
  const {
    isLoading,
    data: {
      result: comments,
      meta: { count },
    },
    refetch,
  } = useQuery({
    queryKey: ["comments", page],
    queryFn: () => apiClient("/comments", { params: { page } }),
    initialData,
    enabled: false,
  })
  const { mutateAsync: deleteComment } = useMutation({
    mutationFn: (id) => apiClient.delete(`/comments/${id}`),
    onSuccess: refetch,
  })
  const handleClickDelete = async (event) => {
    const commentId = Number.parseInt(event.target.getAttribute("data-id"), 10)
    await deleteComment(commentId)
  }

  return (
    <div className="relative">
      {isLoading && <Loader />}
      <table className="w-full">
        <thead>
          <tr>
            {["#", "Comment", "🗑️"].map((label) => (
              <th
                key={label}
                className="p-4 bg-slate-300 text-center font-semibold"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comments.map(({ id, comment }) => (
            <tr key={id} className="even:bg-slate-100">
              <td className="p-4">{id}</td>
              <td className="p-4">{comment}</td>
              <td className="p-4">
                <button
                  data-id={id}
                  onClick={handleClickDelete}
                  className="text-red-500"
                >
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

export default CommentsPage

