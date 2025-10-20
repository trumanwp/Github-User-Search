import './App.css'
import Sun from "../src/assets/icon-sun.svg"
import Moon from "../src/assets/icon-moon.svg"
import Search from "../src/assets/icon-search.svg"
import Location from "../src/assets/icon-location.svg"
import Website from "../src/assets/icon-website.svg"
import Twitter from "../src/assets/icon-twitter.svg"
import Business from "../src/assets/icon-company.svg"
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";


function App() {

    // Test commit here

    const [username, setUsername] = useState("");
    const [submittedUser, setSubmittedUser] = useState(null);
    const [dark, setDark] = useState(true);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["user", submittedUser],  // query depends on submitted username
        queryFn: async () => {
            const res = await fetch(`https://api.github.com/users/${submittedUser}`);
            if (!res.ok) throw new Error("User not found");
            return res.json();
        },
        enabled: !!submittedUser, // only run query if we have a username
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedUser(username); // this kicks off the query
    };

    const toggleDark = () => {
        setDark(!dark);
        document.documentElement.classList.toggle("dark");
        console.log(dark);
    }

    function handleHomeClick(){
        setSubmittedUser(null);
        setUsername("");
    }



  return (
      // Entire page container
    <div className="w-full h-screen bg-[#F5F7FF] dark:bg-[#141B2A] flex flex-col justify-center items-center font-space ">
        {/*80% width container*/}
        <div className="flex flex-col items-center h-screen w-6/7 lg:max-w-1/2 ">

            {/* Navbar*/}
            <nav className="flex flex-row absolute top-0 mt-6 justify-between items-center text-black dark:text-white w-full lg:max-w-1/2">
                <h1 onClick={handleHomeClick} className="ml-10 sm:ml-18 lg:ml-0 text-2xl">devfinder</h1>
                <div className="flex flex-row gap-3 mr-10 sm:mr-16 lg:mr-0 items-center">
                    <h2 className="text-md tracking-widest">{dark ? "DARK" : "LIGHT"}</h2>
                    <img onClick={toggleDark} className="size-5" src={dark ? Sun : Moon} alt="sun icon"/>
                </div>
            </nav>

            {/*User Search*/}
            <form onSubmit={handleSubmit}
                   className="flex flex-row items-center  bg-white dark:bg-[#1C253F] w-full rounded-xl p-2 mt-30 shadow-lg shadow-blue-200 dark:shadow-none">
                <img className="px-2" src={Search} alt="search icon"/>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    className="placeholder-[#838A99] w-50 text-xs text-[#838A99] dark:text-white"
                    type="text"
                    value={username}
                    placeholder="Search Github username..."/>
                <button type="submit"
                        className="bg-blue-600 rounded-xl items-center w-24 h-14 text-white ml-auto">Search
                </button>
            </form>

            {/*User Card*/}

            <div className="w-full mt-6">
                {isError && (
                    <p className="text-red-500 text-center">User Not Found</p>
                )}
            </div>
            {isLoading ? <p className="mt-40 text-black dark:text-white">Loading Data...</p> : data && ( <div className="w-full bg-white dark:bg-[#1C253F] rounded-xl h-150 mt-6 flex flex-col items-center text-[#DFE1E6] shadow-lg shadow-blue-200 dark:shadow-none ">
                <div className="flex flex-col items-center w-6/7 h-full">
                    <div className="flex flex-row mt-6 gap-4 w-full md:justify-center">
                        <img className="size-20 rounded-full" src={data.avatar_url} alt="avatar image"/>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-black dark:text-[#DFE1E6]">{data.login}</h3>
                            <p className="text-blue-600">@{data.login}</p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-[#DFE1E6]">
                                Joined {data && new Date(data.created_at).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                            </p>
                        </div>
                    </div>

                    {/*Card > User Text*/}
                    <p className="mt-8 text-black dark:text-[#DFE1E6]">{data.bio}</p>

                    {/*Card > User Stats*/}
                    <div
                        className="flex flex-row bg-[#F5F7FF] dark:bg-[#141B2A] w-full h-28 rounded-xl mt-6 items-center justify-center gap-8 text-sm">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-gray-500 dark:text-[#DFE1E6]">Repos</span>
                            <span className="text-lg text-black dark:text-[#DFE1E6]">{data.public_repos}</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="text-gray-500 dark:text-[#DFE1E6]">Followers</span>
                            <span className="text-lg text-black dark:text-[#DFE1E6]">{data.followers}</span>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <span className="text-gray-500 dark:text-[#DFE1E6]">Following</span>
                            <span className="text-lg text-black dark:text-[#DFE1E6]">{data.following}</span>
                        </div>
                    </div>

                    {/*User Links*/}
                    <div className="flex flex-col mt-6 w-full gap-4 text-sm text-[#425F90] dark:text-[#DFE1E6]">
                        <div className="flex flex-row gap-4 items-center">
                            <img className="size-6 filter invert dark:invert-0" src={Location} alt="location icon"/>
                            <span>{data.location ? data.location : "No Location Given"}</span>
                        </div>

                        <div className="flex flex-row gap-4 items-center">
                            <img className="size-6 filter invert dark:invert-0" src={Website} alt="website icon"/>
                            <a
                                href={data.blog ? (data.blog.startsWith("http") ? data.blog : `https://${data.blog}`) : "#"}
                            >
                                {data.blog ? data.blog : "No Personal Link Given"}</a>
                        </div>

                        <div className="flex flex-row gap-4 items-center">
                            <img className="size-6 filter invert dark:invert-0" src={Twitter} alt="Twitter icon"/>
                            <span>{data.twitter_username ? data.twitter_username : "No Twitter Linked"}</span>
                        </div>

                        <div className="flex flex-row gap-4 items-center">
                            <img className="size-6 filter invert dark:invert-0" src={Business} alt="Business icon"/>
                            <span>{data.company ? data.company : "No Given Company"}</span>
                        </div>
                    </div>
                </div>


            </div>)}


        </div>
    </div>
  )
}

export default App
