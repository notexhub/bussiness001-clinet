import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

const useCouponsData = () => {
    const {
        data: couponData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["couponData"],
        queryFn: async () => {
            const res = await api.get('/coupon');
            return res.data;
        },
    });

    return {
        couponData,
        couponLoading: isLoading,
        isError,
        error,
        couponRefetch: refetch,
    };
};

export default useCouponsData;
