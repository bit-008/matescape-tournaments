import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Calendar, Medal, Moon, Sun, Users, Clock } from 'lucide-react';
import darkLogo from './assets/dark-bg-copy.png';
import lightLogo from './assets/light-bg-copy.png';

// Demo tournament data with date ranges
const demoTournaments = [
  {
    id: 1,
    name: "Rapid 10|0 & 30|0",
    startDate: "2025-06-20",
    endDate: "2025-06-24",
    type: "rapid",
    status: "ongoing",
    players: "07",
    winners: {
      gold: "TBD",
      silver: "TBD",
      bronze: "TBD"
    },
    excelLink: "https://docs.google.com/spreadsheets/d/16Kk1npleEeacmeK6VBTgHqcJDBwGJApglwTN5XLLjdQ/edit?gid=0#gid=0"
  },
  {
    id: 2,
    name: "Blitz 5|0",
    startDate: "2025-06-25",
    endDate: "2025-06-30",
    type: "blitz",
    status: "upcoming",
    players: "32",
    winners: {
      gold: "TBD",
      silver: "TBD",
      bronze: "TBD"
    },
    excelLink: "#"
  },
];

function App() {
  const [tournaments, setTournaments] = useState(demoTournaments);
  const [filteredTournaments, setFilteredTournaments] = useState(demoTournaments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Get unique date ranges for date filter
  const uniqueDateRanges = [...new Set(tournaments.map(t => `${t.startDate}_${t.endDate}`))].sort();

  // Enhanced search function that includes month and year matching for date ranges
  const createSearchableString = (tournament) => {
    const startDate = new Date(tournament.startDate);
    const endDate = new Date(tournament.endDate);
    const monthNames = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const shortMonthNames = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];
    
    const createDateStrings = (date) => {
      const year = date.getFullYear().toString();
      const month = date.getMonth();
      const monthName = monthNames[month];
      const shortMonthName = shortMonthNames[month];
      const day = date.getDate().toString();
      const monthNumber = (month + 1).toString().padStart(2, '0');
      
      return [
        year,
        monthName,
        shortMonthName,
        monthNumber,
        day,
        `${monthName} ${year}`,
        `${shortMonthName} ${year}`,
        `${monthNumber}/${year}`,
        `${day}/${monthNumber}`,
        `${day}/${monthNumber}/${year}`,
        `${monthName} ${day}`,
        `${shortMonthName} ${day}`,
        `${year}-${monthNumber}`,
        `${year}/${monthNumber}`,
        `${monthNumber}-${day}-${year}`,
        `${day}-${monthNumber}-${year}`,
      ];
    };

    const startDateStrings = createDateStrings(startDate);
    const endDateStrings = createDateStrings(endDate);
    
    return [
      tournament.name,
      tournament.startDate,
      tournament.endDate,
      tournament.type,
      tournament.status,
      ...startDateStrings,
      ...endDateStrings,
    ].join(' ').toLowerCase();
  };

  // Filter tournaments based on search, type, and date
  useEffect(() => {
    let filtered = tournaments;

    // Enhanced search filter
    if (searchTerm) {
      filtered = filtered.filter(tournament => {
        const searchableString = createSearchableString(tournament);
        const searchTerms = searchTerm.toLowerCase().split(' ');
        return searchTerms.every(term => searchableString.includes(term));
      });
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tournament => tournament.type === typeFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const [startDate, endDate] = dateFilter.split('_');
      filtered = filtered.filter(tournament => 
        tournament.startDate === startDate && tournament.endDate === endDate
      );
    }

    setFilteredTournaments(filtered);
  }, [searchTerm, typeFilter, dateFilter, tournaments]);

  // Group tournaments by status and month
  const groupedTournaments = filteredTournaments.reduce((acc, tournament) => {
    const startDate = new Date(tournament.startDate);
    const monthYear = `${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { upcoming: [], completed: [], ongoing: [] };
    }
    
    acc[monthYear][tournament.status].push(tournament);
    return acc;
  }, {});

  // More vibrant colors for light mode, same for dark mode
  const typeColors = {
    rapid: darkMode 
      ? 'from-green-500/60 to-green-400/60' 
      : 'from-green-600 to-green-500',
    blitz: darkMode 
      ? 'from-orange-500/60 to-yellow-400/60' 
      : 'from-orange-600 to-yellow-500',
    bullet: darkMode 
      ? 'from-red-500/60 to-red-400/60' 
      : 'from-red-600 to-red-500',
    classical: darkMode 
      ? 'from-blue-500/60 to-blue-400/60' 
      : 'from-blue-600 to-blue-500'
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  const formatDateRangeForFilter = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startFormatted = start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
    
    const endFormatted = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        {/* Logo - Increased size by 25% */}
        <div className="text-center mb-8">
          <img src={darkMode ? darkLogo : lightLogo} 
            alt="MATESCAPE TOURNAMENTS" 
            className="mx-auto object-contain"
             style={{ height: '95px', maxWidth: '100%' }} />
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 focus:border-purple-400 focus:ring-purple-400 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Sort by Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border backdrop-blur-sm transition-all ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white' 
                  : 'bg-white/70 border-gray-300 hover:bg-white/90'
              }`}
            >
              Sort by Type
              <ChevronDown className="w-4 h-4" />
            </button>
            {sortDropdownOpen && (
              <div className={`absolute top-full mt-2 right-0 rounded-lg border backdrop-blur-sm z-10 min-w-40 ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-600' 
                  : 'bg-white/90 border-gray-300'
              }`}>
                {['all', 'rapid', 'blitz', 'bullet', 'classical'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setSortDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-opacity-50 transition-colors capitalize ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } ${typeFilter === type ? 'font-semibold' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort by Date Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border backdrop-blur-sm transition-all ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white' 
                  : 'bg-white/70 border-gray-300 hover:bg-white/90'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Sort by Date
              <ChevronDown className="w-4 h-4" />
            </button>
            {dateDropdownOpen && (
              <div className={`absolute top-full mt-2 right-0 rounded-lg border backdrop-blur-sm z-10 min-w-48 max-h-60 overflow-y-auto ${
                darkMode 
                  ? 'bg-gray-800/90 border-gray-600' 
                  : 'bg-white/90 border-gray-300'
              }`}>
                <button
                  onClick={() => {
                    setDateFilter('all');
                    setDateDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-opacity-50 transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } ${dateFilter === 'all' ? 'font-semibold' : ''}`}
                >
                  All Dates
                </button>
                {uniqueDateRanges.map(dateRange => {
                  const [startDate, endDate] = dateRange.split('_');
                  return (
                    <button
                      key={dateRange}
                      onClick={() => {
                        setDateFilter(dateRange);
                        setDateDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-opacity-50 transition-colors text-sm ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      } ${dateFilter === dateRange ? 'font-semibold' : ''}`}
                    >
                      {formatDateRangeForFilter(startDate, endDate)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tournament Groups */}
        <div className="space-y-8">
          {Object.entries(groupedTournaments).map(([monthYear, groups]) => (
            <div key={monthYear} className={`rounded-xl p-6 backdrop-blur-sm border ${
              darkMode 
                ? 'bg-gray-800/30 border-gray-700' 
                : 'bg-white/40 border-white/50'
            }`}>
              <h2 className="text-2xl font-bold mb-6 text-center">{monthYear}</h2>
              
              {/* Ongoing Tournaments */}
              {groups.ongoing.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-500 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Ongoing Tournaments
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groups.ongoing.map(tournament => (
                      <div
                        key={tournament.id}
                        onClick={() => setSelectedTournament(tournament)}
                        className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 relative ${
                          darkMode 
                            ? 'border-white/20 hover:border-white/40 bg-gradient-to-r backdrop-blur-lg' 
                            : 'border-white/60 hover:border-white/80 bg-gradient-to-r'
                        } ${typeColors[tournament.type]} text-white shadow-lg hover:shadow-2xl`}
                      >
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="font-bold text-lg mb-2 drop-shadow-sm pr-6">{tournament.name}</h4>
                        <p className="text-sm opacity-90 drop-shadow-sm">{formatDateRange(tournament.startDate, tournament.endDate)}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs capitalize border ${
                          darkMode 
                            ? 'bg-white/20 backdrop-blur-sm border-white/20' 
                            : 'bg-white/40 backdrop-blur-sm border-white/30'
                        }`}>
                          {tournament.type}
                        </span>
                        <div className={`absolute bottom-3 right-3 flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                          darkMode 
                            ? 'bg-white/20 backdrop-blur-sm border-white/20' 
                            : 'bg-white/40 backdrop-blur-sm border-white/30'
                        }`}>
                          <Users className="w-3 h-3" />
                          {tournament.players}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Tournaments */}
              {groups.upcoming.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-blue-500">Upcoming Tournaments</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groups.upcoming.map(tournament => (
                      <div
                        key={tournament.id}
                        onClick={() => setSelectedTournament(tournament)}
                        className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 ${
                          darkMode 
                            ? 'border-white/20 hover:border-white/40 bg-gradient-to-r backdrop-blur-lg' 
                            : 'border-white/60 hover:border-white/80 bg-gradient-to-r'
                        } ${typeColors[tournament.type]} text-white shadow-lg hover:shadow-2xl relative`}
                      >
                        <h4 className="font-bold text-lg mb-2 drop-shadow-sm">{tournament.name}</h4>
                        <p className="text-sm opacity-90 drop-shadow-sm">{formatDateRange(tournament.startDate, tournament.endDate)}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs capitalize border ${
                          darkMode 
                            ? 'bg-white/20 backdrop-blur-sm border-white/20' 
                            : 'bg-white/40 backdrop-blur-sm border-white/30'
                        }`}>
                          {tournament.type}
                        </span>
                        <div className={`absolute bottom-3 right-3 flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                          darkMode 
                            ? 'bg-white/20 backdrop-blur-sm border-white/20' 
                            : 'bg-white/40 backdrop-blur-sm border-white/30'
                        }`}>
                          <Users className="w-3 h-3" />
                          {tournament.players}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tournaments */}
              {groups.completed.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-500">Completed Tournaments</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groups.completed.map(tournament => (
                      <div
                        key={tournament.id}
                        onClick={() => setSelectedTournament(tournament)}
                        className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2 ${
                          darkMode 
                            ? 'border-white/20 hover:border-white/40 bg-gradient-to-r backdrop-blur-lg' 
                            : 'border-white/60 hover:border-white/80 bg-gradient-to-r'
                        } ${typeColors[tournament.type]} text-white relative shadow-lg hover:shadow-2xl`}
                      >
                        <h4 className="font-bold text-lg mb-2 drop-shadow-sm">{tournament.name}</h4>
                        <p className="text-sm opacity-90 drop-shadow-sm">{formatDateRange(tournament.startDate, tournament.endDate)}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs capitalize border ${
                          darkMode 
                            ? 'bg-white/20 backdrop-blur-sm border-white/20' 
                            : 'bg-white/40 backdrop-blur-sm border-white/30'
                        }`}>
                          {tournament.type}
                        </span>
                        <div className={`absolute bottom-3 right-3 flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                          darkMode 
                            ? 'bg-white/20 backdrop-blur-sm border-white/20' 
                            : 'bg-white/40 backdrop-blur-sm border-white/30'
                        }`}>
                          <Users className="w-3 h-3" />
                          {tournament.players}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Details Modal */}
      {selectedTournament && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTournament(null)}
        >
          <div 
            className={`rounded-xl p-6 max-w-md w-full backdrop-blur-sm border ${
              darkMode 
                ? 'bg-gray-800/90 border-gray-600' 
                : 'bg-white/90 border-white/50'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedTournament.name}</h3>
              <button 
                onClick={() => setSelectedTournament(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-sm opacity-75 mb-2">{formatDateRange(selectedTournament.startDate, selectedTournament.endDate)}</p>
            <div className="flex items-center gap-2 text-sm opacity-75 mb-4">
              <Users className="w-4 h-4" />
              <span>{selectedTournament.players} players</span>
              {selectedTournament.status === 'ongoing' && (
                <>
                  <Clock className="w-4 h-4 ml-2 text-yellow-500" />
                  <span className="text-yellow-500">Ongoing</span>
                </>
              )}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Medal className="w-6 h-6 text-yellow-500" />
                <span className="font-semibold">Gold:</span>
                <span>{selectedTournament.winners.gold}</span>
              </div>
              <div className="flex items-center gap-3">
                <Medal className="w-6 h-6 text-gray-400" />
                <span className="font-semibold">Silver:</span>
                <span>{selectedTournament.winners.silver}</span>
              </div>
              <div className="flex items-center gap-3">
                <Medal className="w-6 h-6 text-amber-600" />
                <span className="font-semibold">Bronze:</span>
                <span>{selectedTournament.winners.bronze}</span>
              </div>
            </div>
            
            <a
              href={selectedTournament.excelLink}
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              More Details
            </a>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed bottom-6 right-6 p-3 rounded-full backdrop-blur-sm border transition-all z-40 ${
          darkMode 
            ? 'bg-gray-800/80 border-gray-600 text-yellow-400 hover:bg-gray-700/80' 
            : 'bg-white/80 border-gray-300 text-gray-600 hover:bg-white/90'
        }`}
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  );
}

export default App;
