import Loader from "@/web/components/ui/Loader"
import Pagination from "@/web/components/ui/Pagination"
import apiClient from "@/web/services/apiClient"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"
import React, { useState } from "react"

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
  const { mutateAsync: updatePost } = useMutation({
    mutationFn: ({ postId, editedFields }) => apiClient.patch(`/posts/${postId}`, editedFields),
  })
  const { data: comments } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const result = await apiClient("/comments")
      
      return result.data
    },
    enabled: false
  })
  const handleClickDelete = async (id) => {
    await deletePost(id)
    await refetch()
  }
  const [editedPost, setEditedPost] = useState(null)
  const [editedFields, setEditedFields] = useState({
    name: "",
    description: "",
  })
  const handleInputChange = (e, field) => {
    const { value } = e.target
    setEditedFields((prevFields) => ({ ...prevFields, [field]: value }))
  }
  const handleEditClick = (postId) => {
    setEditedPost(postId)
    const postToEdit = posts.find((post) => post.id === postId)
    setEditedFields({
      name: postToEdit.name,
      description: postToEdit.description,
    })
  }
  const handleSaveEdit = async (postId) => {
  await updatePost({ postId, editedFields })
  setEditedPost(null)
  setEditedFields({
    name: "",
    description: "",
  })
  await refetch()
  }
  /*eslint-disable*/
  return (
    <div className="relative">
      {isFetching && <Loader />}
      <div className="mb-4 text-xl font-semibold">
        Total Posts: {count}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(({ id, name, description, createdAt }) => (
          <div key={id} className="bg-white p-4 rounded-md shadow-md">
            {editedPost === id ? (
<>
                <input
                  type="text"
                  value={editedFields.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Name"/>
                <input
                  type="text"
                  value={editedFields.description}
                  onChange={(e) => handleInputChange(e, "description")}
                  className="mb-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Description"/>
                <button className="mr-2 px-4 py-2 bg-green-500 text-white rounded-md"
                  onClick={() => handleSaveEdit(id)}>
                  Save
                </button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  onClick={() => setEditedPost(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold mb-2">Name : {name}</p>
                <p className="text-xl font-semibold mb-2">Description: {description.slice(0, 50)}
                    {description.length > 50 && (
                      <>
                      <span id={`more-${id}`} style={{ display: "none" }}>{description.slice(50)}</span>
                        <button className="text-blue-500 underline"
                          onClick={() => {
                            const element = document.getElementById(`more-${id}`)

                            if (element) {
                              element.style.display = "inline"
                            }
                          }}
                        >
                          Read More
                        </button>
                      </>)}
                  </p>
                  <p className="text-xl font-semibold mb-2">Created At: {new Date(createdAt).toLocaleString()}</p>
                <div className="mt-4">
                  <p className="font-semibold mb-2">Comments:</p>
                  <ul>
                    {comments &&
                      comments
                        .filter((comment) => comment.PostId === id)
                        .map((comment) => (
                          <li key={comment.id}>{comment.comment}</li>))}
                  </ul>
                </div>
                <button className="mt-4 mr-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => handleEditClick(id)}>
                  Edit
                </button>
                <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => handleClickDelete(id)}>
                  Delete
                </button>
              </>
            )}
          </div>))}
      </div><Pagination count={count} page={page} className="mt-8" /></div>
  )
}

export default IndexPage
