"use server";

import tavilySearch from "@/app/lib/search";


export async function getSearchResults(query:string){

    const searchClient = tavilySearch;

    const results = await searchClient.search({
        query,
        count:5,
    },{
        searchDepth:"basic",
        includeImages:false,
        includeRawContent:true,
        maxTokens:2,
    })

    return results;
}



