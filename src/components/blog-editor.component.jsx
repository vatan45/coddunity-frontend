import { Link } from "react-router-dom";
import logo from "..//imgs/logo.png"
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"
const BlogEditor = () => {
    const handleBannerUpload = (e) => {
        // Corrected 'e.target' instead of 'e.targt'
        const img = e.target.files[0];

        if (img) {
            console.log("Selected file:", img);
            // Further processing of the selected file
        } else {
            console.error("No file selected.");
        }
    };
    return (
        <>
            <nav className="navbar" >
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">

                    new blog
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
                                    src={defaultBanner}
                                    className="z-20"

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

                    </div>
                </section>
            </AnimationWrapper>
        </>



    )
}
export default BlogEditor;