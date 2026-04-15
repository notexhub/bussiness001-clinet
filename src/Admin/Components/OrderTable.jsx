import React from 'react';
import { Eye, CheckCircle, Clock, Trash2, RefreshCw } from 'lucide-react';

const OrderTable = ({
    orders,
    filteredOrders,
    formatDate,
    getStatusStyles,
    handleViewDetails,
    updateStatus,
    deleteOrder,
    loadOrders
}) => {
    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-[#080808]">
                        <tr>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                User Entity
                            </th>
                            <th className="px-6 py-5 text-left text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                Protocol
                            </th>
                            <th className="px-6 py-5 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                Value
                            </th>
                            <th className="px-6 py-5 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                Timestamp
                            </th>
                            <th className="px-6 py-5 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                Status
                            </th>
                            <th className="px-6 py-5 text-center text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                Commands
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders?.map((order) => (
                            <tr
                                key={order?._id}
                                className="hover:bg-gray-50/50 transition-all duration-300 group"
                            >
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="text-sm font-black text-[#080808] tracking-tight group-hover:text-green-600 transition-colors">
                                        {order?.userName || 'Anonymous'}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                        {order?.userEmail}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-[#080808] text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                        {order?.planName || 'Generic Plan'}
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center font-black text-[#080808] tracking-tighter">
                                    ৳{Number(order?.amount || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                    {formatDate(order?.orderDate)}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center">
                                    <span
                                        className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${getStatusStyles(
                                            order?.status
                                        )}`}
                                    >
                                        {order?.status || 'unknown'}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleViewDetails(order)}
                                            className="p-2.5 bg-gray-50 text-[#080808] hover:bg-[#080808] hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                                            title="Diagnostic View"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        {order?.status?.toLowerCase() !== 'approved' && (
                                            <button
                                                onClick={() => updateStatus(order?._id, 'approved')}
                                                className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-green-100"
                                                title="Authorize"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                        )}

                                        {order?.status?.toLowerCase() !== 'pending' && (
                                            <button
                                                onClick={() => updateStatus(order?._id, 'pending')}
                                                className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-amber-100"
                                                title="Queue"
                                            >
                                                <Clock size={18} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteOrder(order?._id)}
                                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-red-100"
                                            title="Terminate"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Synchronized Entities: {filteredOrders?.length || 0} / {orders?.length || 0}
                </span>
                <button
                    onClick={loadOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-[#080808] text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                >
                    <RefreshCw size={14} />
                    Sync Data
                </button>
            </div>
        </div>
    );
};

export default OrderTable;
