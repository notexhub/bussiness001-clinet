import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

const useSettingsData = () => {
    const {
        data: settingsData = {},
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["settingsData"],
        queryFn: async () => {
            const res = await api.get('/settings');
            return res.data;
        },
    });

    return {
        settingsData,
        settingsLoading: isLoading,
        isError,
        error,
        settingsRefetch: refetch,
    };
};

export default useSettingsData;
