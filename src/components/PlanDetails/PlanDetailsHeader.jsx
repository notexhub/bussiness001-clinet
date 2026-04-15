import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PlanDetailsHeader = ({ order, subscription, id }) => {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl shadow-xl overflow-hidden text-white">
            <div className="px-6 py-9">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="h-10 w-10 opacity-90" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">{order.planName || 'Your Plan'}</h1>
                        <p className="mt-2 opacity-90 text-sm font-mono">Order #{id.slice(-8)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                    <p className="text-sm opacity-80">Duration</p>
                    <p className="text-2xl font-bold">{subscription.validityDays} days</p>
                </div>
                <div>
                    <p className="text-sm opacity-80">Purchased</p>
                    <p className="text-xl font-semibold">
                        {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })
                            : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-sm opacity-80">Status</p>
                    <p className="text-xl font-semibold">Active</p>
                </div>
            </div>
        </div>
    );
};

export default PlanDetailsHeader;
