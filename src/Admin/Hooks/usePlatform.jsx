import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

const usePlatform = () => {
    const {
        data: platforms = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["platforms"],
        queryFn: async () => {
            const res = await api.get('/platform');
            return res.data;
        },
    });

    return {
        platforms,
        platformLoading: isLoading,
        isError,
        error,
        platformRefetch: refetch,
    };
};

export default usePlatform;
