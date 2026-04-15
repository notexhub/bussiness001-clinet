import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

const useCategory = () => {
    const {
        data: categoryData = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["categoryData"],
        queryFn: async () => {
            const res = await api.get('/category');
            return res.data;
        },
    });

    return {
        categoryData,
        categoryLoading: isLoading,
        isError,
        error,
        categoryRefetch: refetch,
    };
};

export default useCategory;
