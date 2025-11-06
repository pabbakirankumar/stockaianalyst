'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';

export default function FinanceChatbot() {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { messages, sendMessage } = useChat({
    onError: (error) => {
      console.error('Chat error:', error);
      setIsLoading(false);
    }
  });

  // Track loading state and detect when streaming completes
  useEffect(() => {
    // Safety: always reset loading if there are no messages
    if (messages.length === 0) {
      setIsLoading(false);
      return;
    }
    
    if (!isLoading) return; // Only process if we're in loading state
    
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && lastMessage.role === 'assistant') {
      // Check if assistant message has complete text content
      const textParts = lastMessage.parts.filter(part => part.type === 'text');
      if (textParts.length > 0) {
        const hasCompleteText = textParts.some(part => 
          part.text && typeof part.text === 'string' && part.text.trim().length > 0
        );
        
        if (hasCompleteText) {
          // Message appears complete, stop loading after a brief delay
          const timer = setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [messages, isLoading]);

  // Safety timeout: if loading is true for more than 30 seconds, reset it
  useEffect(() => {
    if (!isLoading) return;
    
    const timeout = setTimeout(() => {
      console.warn('Loading state timeout - resetting');
      setIsLoading(false);
    }, 30000); // 30 second timeout
    
    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Initialize: ensure loading is false on mount
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const tabs = ['Dashboard', 'Expenses', 'Investments', 'AI Insights', 'Settings'];
  
  // Sample data
  const userProfile = {
    name: 'Alex Johnson',
    balance: '$45,678.90',
    avatar: '👤'
  };

  const quickActions = [
    { icon: '📊', label: 'Transactions', color: 'bg-blue-500', action: 'Expenses' },
    { icon: '💰', label: 'Budget', color: 'bg-emerald-500', action: 'Expenses' },
    { icon: '📈', label: 'Investments', color: 'bg-purple-500', action: 'Investments' },
    { icon: '💡', label: 'AI Insights', color: 'bg-amber-500', action: 'AI Insights' },
  ];

  const sampleInsights = [
    { title: 'Top Saving Tips', icon: '💡', color: 'bg-emerald-100 dark:bg-emerald-900/30', id: 'saving-tips' },
    { title: 'Market Update', icon: '📈', color: 'bg-blue-100 dark:bg-blue-900/30', id: 'market-update' },
    { title: 'Tax Advice', icon: '📋', color: 'bg-purple-100 dark:bg-purple-900/30', id: 'tax-advice' },
  ];

  const insightData: { [key: string]: { title: string; content: string[]; keyPoints?: string[] } } = {
    'saving-tips': {
      title: 'Top Saving Tips',
      content: [
        'Automate your savings: Set up automatic transfers to your savings account on payday.',
        'Use the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings.',
        'Track your expenses: Use budgeting apps to identify where your money goes.',
        'Cut subscription costs: Review and cancel unused subscriptions.',
        'Build an emergency fund: Aim for 3-6 months of living expenses.',
      ],
      keyPoints: [
        '💰 Save $500/month by automating transfers',
        '📊 Track expenses to reduce spending by 15%',
        '🎯 Emergency fund goal: $10,000',
      ]
    },
    'market-update': {
      title: 'Market Update',
      content: [
        'S&P 500: +2.3% this week, currently at 4,850 points',
        'NASDAQ: +3.1% this week, tech stocks performing well',
        'DOW Jones: +1.8% this week, steady growth continues',
        'Crypto Markets: Bitcoin up 5.2%, Ethereum up 4.8%',
        'Bond Yields: 10-year Treasury at 4.2%, stable',
      ],
      keyPoints: [
        '📈 Tech sector showing strong momentum',
        '💹 Volatility index (VIX) at 15.2 (low)',
        '🌍 Global markets up 2.1% average',
      ]
    },
    'tax-advice': {
      title: 'Tax Advice',
      content: [
        'Maximize retirement contributions: 401(k) limit is $23,000 for 2024',
        'Consider tax-loss harvesting: Offset gains with losses by year-end',
        'Document all deductions: Keep receipts for business expenses, donations',
        'Review tax brackets: Plan income to stay in favorable brackets',
        'File early: Avoid last-minute mistakes and potential penalties',
      ],
      keyPoints: [
        '📋 Deadline: April 15, 2025',
        '💼 Estimated savings: $2,500 with proper planning',
        '📊 Tax bracket: 22% for most earners',
      ]
    }
  };

  const quickActionData: { [key: string]: any } = {
    'Transactions': {
      title: 'Recent Transactions',
      transactions: [
        { date: '2024-01-15', description: 'Grocery Store', amount: '-$127.50', category: 'Food & Dining' },
        { date: '2024-01-14', description: 'Salary Deposit', amount: '+$3,500.00', category: 'Income' },
        { date: '2024-01-13', description: 'Gas Station', amount: '-$45.20', category: 'Transportation' },
        { date: '2024-01-12', description: 'Netflix Subscription', amount: '-$15.99', category: 'Entertainment' },
        { date: '2024-01-11', description: 'Investment Dividend', amount: '+$125.00', category: 'Investments' },
      ]
    },
    'Budget': {
      title: 'Budget Summary',
      categories: [
        { name: 'Food & Dining', spent: '$450', budget: '$600', percentage: 75 },
        { name: 'Transportation', spent: '$280', budget: '$400', percentage: 70 },
        { name: 'Shopping', spent: '$320', budget: '$500', percentage: 64 },
        { name: 'Bills & Utilities', spent: '$380', budget: '$400', percentage: 95 },
      ],
      totalSpent: '$1,430',
      totalBudget: '$1,900',
      remaining: '$470'
    },
    'Investments': {
      title: 'Investment Portfolio',
      holdings: [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 25, value: '$4,250', change: '+2.3%' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 15, value: '$2,100', change: '+3.1%' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 20, value: '$7,200', change: '+1.8%' },
        { symbol: 'TSLA', name: 'Tesla Inc.', shares: 10, value: '$2,500', change: '+4.2%' },
      ],
      totalValue: '$16,050',
      totalChange: '+2.85%'
    },
  };

  const formatMessage = (text: string) => {
    // Add emoji detection and formatting
    const emojiMap: { [key: string]: string } = {
      'budget': '💰',
      'investment': '📈',
      'advice': '💬',
      'expense': '📊',
      'saving': '💾',
      'goal': '🎯',
    };
    
    let formatted = text;
    Object.keys(emojiMap).forEach(key => {
      if (text.toLowerCase().includes(key)) {
        formatted = text.replace(new RegExp(key, 'gi'), `${emojiMap[key]} ${key}`);
      }
    });
    
    return formatted;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar */}
        <div className={`w-80 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} border-r shadow-lg flex flex-col`}>
          {/* User Profile */}
          <div className={`p-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} text-white`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                {userProfile.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold">{userProfile.name}</h2>
                <p className="text-emerald-100 text-sm">Account Balance</p>
              </div>
            </div>
            <div className="text-3xl font-bold">{userProfile.balance}</div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(action.action)}
                  className={`${action.color} text-white p-4 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-md active:scale-95`}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="text-xs font-medium">{action.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 px-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Navigation</h3>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab
                      ? isDarkMode 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-emerald-500 text-white shadow-md'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-slate-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-gray-100 text-gray-700'
              } transition-all`}
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-b shadow-sm px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeTab === 'Dashboard' && '💰 Finance Dashboard'}
                  {activeTab === 'Expenses' && '📊 Expense Tracking'}
                  {activeTab === 'Investments' && '📈 Investments'}
                  {activeTab === 'AI Insights' && '💡 AI Insights'}
                  {activeTab === 'Settings' && '⚙️ Settings'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activeTab === 'Dashboard' && 'Your financial overview'}
                  {activeTab === 'Expenses' && 'Track and analyze your spending'}
                  {activeTab === 'Investments' && 'Portfolio performance and insights'}
                  {activeTab === 'AI Insights' && 'Personalized financial recommendations'}
                  {activeTab === 'Settings' && 'Account and preferences'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                  💰 Bill Reminder
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className={`flex-1 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-6 overflow-y-auto`}>
              <div className="grid grid-cols-3 gap-4">
                {sampleInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                    className={`${insight.color} p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 ${
                      selectedInsight === insight.id ? 'ring-2 ring-emerald-500 shadow-xl' : ''
                    }`}
                  >
                    <div className="text-2xl mb-2">{insight.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">View details →</p>
                  </div>
                ))}
              </div>

              {/* Display selected insight data */}
              {selectedInsight && insightData[selectedInsight] && (
                <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg border-2 border-emerald-500`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      {insightData[selectedInsight].title}
                    </h3>
                    <button
                      onClick={() => setSelectedInsight(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Information:</h4>
                      <ul className="space-y-2">
                        {insightData[selectedInsight].content.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {insightData[selectedInsight].keyPoints && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Stats:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {insightData[selectedInsight].keyPoints!.map((point, idx) => (
                            <div key={idx} className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                              <p className="text-sm text-gray-700 dark:text-gray-300">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {activeTab === 'Expenses' && (
                  <div className="space-y-6">
                    {quickActionData['Transactions'] && (
                      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                        <h3 className="text-xl font-bold mb-4">📊 Recent Transactions</h3>
                        <div className="space-y-3">
                          {quickActionData['Transactions'].transactions.map((tx: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{tx.description}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date} • {tx.category}</p>
                              </div>
                              <span className={`font-semibold ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {tx.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {quickActionData['Budget'] && (
                      <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                        <h3 className="text-xl font-bold mb-4">�� Budget Summary</h3>
                        <div className="space-y-4">
                          {quickActionData['Budget'].categories.map((cat: any, idx: number) => (
                            <div key={idx}>
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{cat.name}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{cat.spent} / {cat.budget}</span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${cat.percentage >= 90 ? 'bg-red-500' : cat.percentage >= 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${cat.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                          <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-900 dark:text-white">Remaining Budget:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{quickActionData['Budget'].remaining}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Investments' && (
                  <div className="space-y-6">
                    {quickActionData['Investments'] && (
                      <>
                        <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">📈 Investment Portfolio</h3>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">{quickActionData['Investments'].totalValue}</p>
                              <p className={`text-sm font-medium ${quickActionData['Investments'].totalChange.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                {quickActionData['Investments'].totalChange}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {quickActionData['Investments'].holdings.map((holding: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">{holding.symbol}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{holding.name} • {holding.shares} shares</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900 dark:text-white">{holding.value}</p>
                                  <p className={`text-xs font-medium ${holding.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {holding.change}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    🎯 Savings Goal Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Emergency Fund</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">$8,500 / $10,000</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Vacation Fund</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">$2,300 / $5,000</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '46%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`w-96 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-l shadow-2xl flex flex-col`}>
              <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} p-4 text-white`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl animate-float">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-bold">Finance AI Assistant</h3>
                    <p className="text-xs text-emerald-100">Always here to help</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="space-y-4">
                    <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-emerald-50'} rounded-2xl p-4`}>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        👋 Hi! I'm your Finance AI Assistant. I can help you with:
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <li>• Track your expenses 📊</li>
                        <li>• Analyze spending patterns 💰</li>
                        <li>• Investment recommendations 📈</li>
                        <li>• Budget planning 💡</li>
                      </ul>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'} rounded-2xl p-4`}>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        📊 Your expenses this week increased by 12% compared to last week.
                      </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-purple-50'} rounded-2xl p-4`}>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        💡 Would you like me to suggest investment options based on your risk profile?
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.role === 'user'
                          ? isDarkMode
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-500 text-white'
                          : isDarkMode
                            ? 'bg-slate-700 text-gray-100'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.parts.map((part, i) => {
                        if (part.type === 'text') {
                          return (
                            <p key={`${message.id}-${i}`} className="text-sm whitespace-pre-wrap">
                              {formatMessage(part.text)}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-2xl p-3`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'} border-t p-4`}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      setIsLoading(true);
                      sendMessage({ text: input });
                      setInput('');
                    }
                  }}
                  className="flex items-center space-x-2"
                >
                  <button
                    type="button"
                    className={`p-3 ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-gray-100'} rounded-full shadow-md transition-all transform hover:scale-110`}
                    title="Voice input"
                  >
                    🎤
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything about your finances..."
                    className={`flex-1 px-4 py-3 rounded-full ${
                      isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                    } border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm`}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-3 rounded-full shadow-md transition-all transform hover:scale-110 ${
                      input.trim() && !isLoading
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-lg">➤</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}