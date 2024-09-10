import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";

const BlogEditor = () => {
    let blogBannerRef = useRef();

    let { blog, setBlog, blog: { title, banner, content }, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);

    // Initialize EditorJS
    useEffect(() => {
        const editor = new EditorJS({
            holder: "textEditor", // Make sure this matches the div id
            tools: tools,
            placeholder: "Let's write an awesome blog!",
            data: content ? { blocks: content } : {}, // Load existing content
            onChange: () => {
                // Capture content change on every update
                editor.save().then((outputData) => {
                    setBlog(prevBlog => ({ ...prevBlog, content: outputData.blocks }));
                }).catch(err => console.error("Error saving blog:", err)); // Added error handling
            }
        });

        setTextEditor(editor);

        return () => {
            editor.isReady.then(() => {
                editor.destroy(); // Clean up on component unmount
            }).catch((err) => console.error("Error in Editor.js cleanup:", err));
        };
    }, []);

    const handleBannerUpload = (e) => {
        const img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...");
            uploadImage(img).then((url) => {
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded 👍");
                    setBlog(prevBlog => ({ ...prevBlog, banner: url }));
                }
            }).catch(err => {
                toast.dismiss(loadingToast);
                return toast.error(err);
            });
        } else {
            console.error("No file selected.");
        }
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode === 13) { // Fix the key code check
            e.preventDefault();
        }
    };

    const handleTitleChange = (e) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
        setBlog(prevBlog => ({ ...prevBlog, title: input.value }));
    };

    const handleError = (e) => {
        let img = e.target;
        img.src = defaultBanner;
    };

    const handlePublishEvent = () => {
        // if (!banner.length) {
        //     return toast.error("Upload a blog banner to publish it");
        // }
        // if (!title.length) {
        //     return toast.error("Write blog title to publish it");
        // }

        //    if (textEditor.isReady) {
        textEditor.save().then(data => {
            //if (data.blocks.length) {
            setBlog(prevBlog => ({ ...prevBlog, content: data }));
            setEditorState("publish");
            // } else {
            //return toast.error("Write something in your blog to publish it");
            //  }
        });
    }

    return (
        <>
            <nav className="navbar">
                <Toaster />
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2" onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className="btn-light py-2">
                        Save Draft
                    </button>
                </div>
            </nav>
            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
                            <label>
                                <img
                                    src={banner || defaultBanner} // Ensure a fallback to defaultBanner
                                    className="z-20"
                                    onError={handleError}
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>
                        <textarea
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        />
                        <hr className="w-full opacity-10 my-5" />
                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;
