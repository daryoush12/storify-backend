export const uid = (length:number):string => {

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let rs = "";

    for(let i = 0; i < length; i++){
        rs += alphabet[Math.random()*alphabet.length];
    }

    return rs;
};