export const uid = (length:number):string => {

    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGIJKLMNOPQRSTUVWXYZ1234567890";
    let rs = "";

    for(let i = 0; i < length; i++){
        rs += alphabet[randomNumber(alphabet.length)];
    }

    return rs;
};

const randomNumber = (max:number):number => Math.floor(Math.random() * max);
