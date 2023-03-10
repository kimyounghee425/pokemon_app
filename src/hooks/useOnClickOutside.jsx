import { useEffect } from "react";

export default function useOnclickOutside(ref, handler) {

    useEffect(() => {
        const listener = (event) => {
            console.log(event.target);
            // 모달 안을 클릭했는지 
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            // 모달 밖을 클릭했는지 

            handler();

        }

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);

        }
    }, [ref, handler])

}