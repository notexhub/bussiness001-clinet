import React from 'react';

const CheckoutPaymentMethod = ({ paymentMethods, activeMethod, setActiveMethod, setSenderNumber }) => {
    return (
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2.5 min-w-max">
                {paymentMethods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => {
                            setActiveMethod(method.id);
                            setSenderNumber('');
                        }}
                        className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all min-h-[44px]
                        ${activeMethod === method.id
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <method.icon size={18} />
                        {method.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CheckoutPaymentMethod;
