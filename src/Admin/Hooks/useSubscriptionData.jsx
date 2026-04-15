import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

const useSubscriptionData = () => {
    const {
        data: subscriptionData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["subscriptionData"],
        queryFn: async () => {
            const res = await api.get('/subscription');
            return res.data;
        },
    });

    return {
        subscriptionData,
        subscriptionLoading: isLoading,
        isError,
        error,
        subscriptionRefetch: refetch,
    };
};

export default useSubscriptionData;
