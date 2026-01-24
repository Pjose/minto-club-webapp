import { useCallback, useState } from "react"

const useConfirmReason = () => {
    const [showReason, setShowReason] = useState(false)
    const [resolvePromise, setResolvePromise] = useState(null)

    const showConfirmReason = useCallback(() => {
        setShowReason(true)
        return new Promise((resolve) => {
            setResolvePromise(() => resolve)
        })
    }, [])

    const handleConfirmReason = useCallback(() => {
        setShowReason(false)
        if(resolvePromise) {
            resolvePromise(true)
        }
    }, [resolvePromise])

    const handleCancelReason = useCallback(() => {
        setShowReason(false)
        if(resolvePromise) {
            resolvePromise(false)
        }
    }, [resolvePromise])

    return {
        showReason,
        showConfirmReason,
        handleConfirmReason,
        handleCancelReason,
    }
}

export default useConfirmReason
