"use client"
import axios from "axios"
import { createContext, useContext, useState } from "react"


const IptvContext = createContext(null)

export function IptvProvider ({children}) {
    const [categories , setCategories] = useState()
    const [channels , setChannels] = useState()
    const [userInfo , setUserInfo] = useState({
        host : process.env.NEXT_PUBLIC_IPTV_HOST,
        user : process.env.NEXT_PUBLIC_IPTV_USERNAME,
        password : process.env.NEXT_PUBLIC_IPTV_PASSWORD
    })
    const [loading , setLoading] = useState(false)
    const [streamUrl , setStreamUrl] = useState()

    const formatStramUrl = (chanId) => {
        // setStreamUrl(`${userInfo.host}/live/${userInfo.user}/${userInfo.password}/${chanId}.m3u8`)
        setStreamUrl(`/api/stream?id=${chanId}`)
    }

    


    const fetchCategories = async () => {
        try {
            setLoading(true);
      
            // const params = {
            //   username: userInfo.user,
            //   password: userInfo.password,
            //   action: "get_live_categories",
            // };
      
            // const res = await axios.get(
            //   `${userInfo.host}/player_api.php`,
            //   { params }
            // );

            const res = await axios.get('/api/data/categories')
      
            setCategories(res.data);
            return res.data;
          } catch (error) {
            console.error("Failed to fetch categories", error);
          } finally {
            setLoading(false);
          }
    }

    const fetchChannels = async (catId) => {
        try {
            setLoading(true);
      
            const params = {
              username: userInfo.user,
              password: userInfo.password,
              action: "get_live_streams",
              category_id : catId
            };
      
            const res = await axios.get(
              `${userInfo.host}/player_api.php`,
              { params }
            );
      
            setChannels(res.data);
            return res.data;
          } catch (error) {
            console.error("Failed to fetch categories", error);
          } finally {
            setLoading(false);
          }
    }

    return (
        <IptvContext.Provider
            value={{
                categories,
                channels,
                userInfo,
                fetchCategories,
                loading,
                fetchChannels,
                formatStramUrl,
                streamUrl
            }}
        >
            {children}
        </IptvContext.Provider>
    )
}

export function useIptv() {
    const context = useContext(IptvContext);
    if (!context) {
      throw new Error("useIptv must be used inside IptvProvider");
    }
    return context;
  }

