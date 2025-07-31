import React, { useState, useMemo } from 'react';
import type { Client } from '../types';

interface ClientSelectorProps {
  clients: Client[];
  selectedClient: Client | null;
  onClientSelect: (client: Client) => void;
  onClose: () => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  clients,
  selectedClient,
  onClientSelect,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) || 
      client.phone.includes(term)
    );
  }, [clients, searchTerm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">Select Client</h3>
            <p className="text-xs sm:text-sm text-slate-600">Choose a client for this appointment</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 sm:p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search */}
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:border-healthtick-500 focus:outline-none focus:ring-1 focus:ring-healthtick-500"
              autoFocus
            />
          </div>
        </div>
        
        {/* Client List */}
        <div className="max-h-64 sm:max-h-80 overflow-y-auto px-2 pb-3 sm:pb-4">
          {filteredClients.length > 0 ? (
            <div className="space-y-1">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => onClientSelect(client)}
                  className={`w-full rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-left transition-all duration-200 ${
                    selectedClient?.id === client.id 
                      ? 'bg-healthtick-100 border border-healthtick-300 text-healthtick-900' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-medium ${
                      selectedClient?.id === client.id 
                        ? 'bg-healthtick-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate text-sm sm:text-base ${
                        selectedClient?.id === client.id ? 'text-healthtick-900' : 'text-slate-900'
                      }`}>
                        {client.name}
                      </div>
                      <div className={`text-xs sm:text-sm truncate ${
                        selectedClient?.id === client.id ? 'text-healthtick-700' : 'text-slate-600'
                      }`}>
                        {client.phone}
                      </div>
                    </div>
                    {selectedClient?.id === client.id && (
                      <div className="text-healthtick-600">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="mb-2 sm:mb-3 rounded-full bg-slate-100 p-2 sm:p-3">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-900">No clients found</div>
              <div className="text-xs sm:text-sm text-slate-600">Try adjusting your search terms</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
