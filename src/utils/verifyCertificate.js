export const verify = async (hash) => {
    const response = await fetch(`http://localhost:5000/${hash}`, {
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