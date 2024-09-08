import { createContext, useContext, useState } from "react";
import { usercontext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const blogStructure = {
    title: '',
    banner: '',
    content: [],
    tags: [],
    des: '',
    author: { personal_info: {} }
}

export const EditorContext = createContext({});


const Editor = () => {

    const [blog, setBlog] = useState(blogStructure)

    const [editorState, setEditorState] = useState("editor");

    let { userAuth: { access_token } } = useContext(usercontext)

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState }}>
            {
                access_token === null ? <Navigate to="/signin" />
                    : editorState == "editor" ? <BlogEditor /> : <PublishForm />
            }
        </EditorContext.Provider>
    )
}
export default Editor;