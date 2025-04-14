export const verify = async (hash) => {
    const response = await fetch(`https://certichain-e6kz.onrender.com/${hash}`, {
        method: "GET"
    });
    const result = await response.json();
    if(result.hash){
        return true;
    }
    else{
        return false;
    }
}