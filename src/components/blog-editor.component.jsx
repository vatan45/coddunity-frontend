import { Link } from "react-router-dom";
import logo from "..//imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"
import { uploadImage } from "../common/aws";
import { useContext, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
const BlogEditor = () => {
    let blogBannerRef = useRef();

    let { blog, setBlog, blog: { title, banner, content, tags, des } } = useContext(EditorContext);

    useEffect(() => {
        let editor = new EditorJS({
            holderId: "textEditor",
            data: '',
            tools: tools,
            placeholder: "Lets write an awesome project"
        })
    }, [])

    const handleBannerUpload = (e) => {
        const img = e.target.files[0];
        if (img) {

            let loadingToast = toast.loading("uploading ...")

            uploadImage(img).then((url) => {
                if (url) {
                    toast.dismiss(loadingToast);
                    toast.success("Uploaded 👍")
                    setBlog({ ...blog, banner: url })

                }
            })
                .catch(err => {
                    toast.dismiss(loadingToast);
                    return toast.error(err);
                })
            // Further pr👍ocessing of the selected file
        } else {
            console.error("No file selected.");
        }
    };
    const handleTitleKeyDown = (e) => {

        if (e.KeyCode == 13) {
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        const input = e.target;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
        setBlog({ ...blog, title: input.value });
    };
    const handleError = (e) => {
        let img = e.target;
        img.src = defaultBanner;
    }

    return (
        <>
            <nav className="navbar" >
                <Toaster />
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length ? title : "new blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2">
                        publish
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

                                    src={banner}
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
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none
                             resize-none mt-10 leading-tight placeholder:opacity-40 
                             " onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>



                    </div>
                </section>
            </AnimationWrapper>
        </>



    )
}
export default BlogEditor;