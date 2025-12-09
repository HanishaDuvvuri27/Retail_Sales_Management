import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import SummaryCards from "../components/SummaryCards";
import TransactionsTable from "../components/TransactionsTable";
import SortingDropdown from "../components/SortDropdown";
import Pagination from "../components/Pagination";
import { FiHome, FiLink, FiInbox, FiFileText, FiRefreshCw } from "react-icons/fi";
import {
  fetchSales,
  fetchTags,
  fetchPaymentMethods,
  fetchCategories,
} from "../services/api.js";

import "../styles/dashboard.css";

const defaultSummary = {
  totalUnitsSold: 0,
  totalAmount: 0,
  totalDiscount: 0,
};

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const headerRef = useRef(null);
  const [headerOpen, setHeaderOpen] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(true);
  const [invoicesOpen, setInvoicesOpen] = useState(true);
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    ageRange: "",
    categories: [],
    tags: [],
    paymentMethods: [],
    dateFrom: "",
    dateTo: "",
  });

  const [sort, setSort] = useState({
    sortBy: "customerName",
    sortOrder: "asc",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(defaultSummary);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagOptions, setTagOptions] = useState([
    { value: "", label: "Tags" },
    { value: "Sale", label: "Sale" },
    { value: "New", label: "New" },
    { value: "Seasonal", label: "Seasonal" },
  ]);
  const [paymentOptions, setPaymentOptions] = useState([
    { value: "", label: "Payment Method" },
    { value: "Card", label: "Card" },
    { value: "Cash", label: "Cash" },
    { value: "UPI", label: "UPI" },
  ]);
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "", label: "Product Category" },
    { value: "Clothing", label: "Clothing" },
    { value: "Electronics", label: "Electronics" },
    { value: "Grocery", label: "Grocery" },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        // Parse age range into Min/Max
        let ageMin = undefined;
        let ageMax = undefined;
        if (filters.ageRange) {
          const ageParts = filters.ageRange.split("-");
          if (ageParts.length === 2) {
            ageMin = parseInt(ageParts[0], 10);
            ageMax = parseInt(ageParts[1], 10);
          }
        }

        const params = {
          search: search || undefined,
          regions:
            filters.regions && filters.regions.length
              ? filters.regions.join(",")
              : undefined,
          genders:
            filters.genders && filters.genders.length
              ? filters.genders.join(",")
              : undefined,
          ageMin: ageMin || undefined,
          ageMax: ageMax || undefined,
          categories:
            filters.categories && filters.categories.length
              ? filters.categories.join(",")
              : undefined,
          tags:
            filters.tags && filters.tags.length
              ? filters.tags.join(",")
              : undefined,
          paymentMethods:
            filters.paymentMethods && filters.paymentMethods.length
              ? filters.paymentMethods.join(",")
              : undefined,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          page,
          pageSize,
        };

        const payload = (await fetchSales(params)) || {};

        setRows(payload.data || []);
        setSummary(payload.summary || defaultSummary);
        setTotalPages(payload.totalPages || 1);
      } catch (e) {
        console.error(e);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    load();

  }, [search, filters, sort, page]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      const mainContent = document.querySelector(".main-content");
      if (mainContent && mainContent.contains(e.target)) return;
      const sidebar = headerRef.current?.closest(".sidebar");
      if (sidebar && !sidebar.contains(e.target)) {
        setHeaderOpen(false);
      }
    };

    if (headerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [headerOpen]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    if (nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  // Load tag options based on selected categories
  useEffect(() => {
    const loadTags = async () => {
      try {
        const categoriesParam =
          filters.categories && filters.categories.length
            ? filters.categories.join(",")
            : undefined;
        const res = await fetchTags({ categories: categoriesParam });
        const tags = res?.tags || res?.data?.tags || [];
        const options =
          tags && tags.length
            ? [{ value: "", label: "Tags" }, ...tags.map((t) => ({ value: t, label: t }))]
            : [
                { value: "", label: "Tags" },
                { value: "Sale", label: "Sale" },
                { value: "New", label: "New" },
                { value: "Seasonal", label: "Seasonal" },
              ];

        setTagOptions(options);

        // clear selected tags if they are no longer in options
        if (
          filters.tags &&
          filters.tags.length &&
          !filters.tags.every((t) => options.some((o) => o.value === t))
        ) {
          setFilters((prev) => ({ ...prev, tags: [] }));
        }
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    };

    loadTags();
    
  }, [filters.categories]);

  // Load payment methods once
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await fetchPaymentMethods();
        const methods = res?.paymentMethods || res?.data?.paymentMethods || [];
        const options =
          methods && methods.length
            ? [{ value: "", label: "Payment Method" }, ...methods.map((m) => ({ value: m, label: m }))]
            : [
                { value: "", label: "Payment Method" },
                { value: "Card", label: "Card" },
                { value: "Cash", label: "Cash" },
                { value: "UPI", label: "UPI" },
              ];
        setPaymentOptions(options);
      } catch (err) {
        console.error("Failed to load payment methods", err);
      }
    };

    loadPayments();
  }, []);

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        const categories = res?.categories || res?.data?.categories || [];
        const options =
          categories && categories.length
            ? [{ value: "", label: "Product Category" }, ...categories.map((c) => ({ value: c, label: c }))]
            : [
                { value: "", label: "Product Category" },
                { value: "Clothing", label: "Clothing" },
                { value: "Electronics", label: "Electronics" },
                { value: "Grocery", label: "Grocery" },
              ];
        setCategoryOptions(options);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="app-shell">
      
      <aside className="sidebar">
        <div
          className="sidebar-header"
          ref={headerRef}
          onClick={() => setHeaderOpen((s) => !s)}
          role="button"
          tabIndex={0}
        >
          <div className="sidebar-logo-box">H</div>
          <div className="sidebar-title">
            <div className="sidebar-logo-text">Vault</div>
            <div className="sidebar-user">Hanisha Duvvuri</div>
          </div>
          <span className={`sidebar-chevron ${headerOpen ? "open" : ""}`}>▾</span>
        </div>

        {headerOpen && (
          <div className="sidebar-header-menu">
            <button
              className="sidebar-header-item selected"
              type="button"
            >
              <span className="sidebar-icon"><FiHome /></span>
              <span>Dashboard</span>
            </button>
            <button
              className="sidebar-header-item"
              type="button"
            >
              <span className="sidebar-icon"><FiLink /></span>
              <span>Nexus</span>
            </button>
            <button
              className="sidebar-header-item"
              type="button"
            >
              <span className="sidebar-icon"><FiInbox /></span>
              <span>Intake</span>
            </button>
          </div>
        )}

        <nav className="sidebar-nav">

          <div className="sidebar-section">
            <button
              type="button"
              className="sidebar-section-title"
              onClick={() => setServicesOpen((s) => !s)}
              aria-expanded={servicesOpen}
            >
              Services <span className={`sidebar-chevron-small ${servicesOpen ? "open" : ""}`}>▾</span>
            </button>

            {servicesOpen && (
              <>
                <button className="sidebar-item">
                  
                  <span>Pre-active</span>
                </button>
                <button className="sidebar-item">
                 
                  <span>Active</span>
                </button>
                <button className="sidebar-item">
                  
                  <span>Blocked</span>
                </button>
                <button className="sidebar-item">
                  
                  <span>Closed</span>
                </button>
              </>
            )}
          </div>
            <div className="sidebar-section">
            <button
              type="button"
              className="sidebar-section-title"
              onClick={() => setInvoicesOpen((s) => !s)}
              aria-expanded={invoicesOpen}
            >
              Invoices <span className={`sidebar-chevron-small ${invoicesOpen ? "open" : ""}`}>▾</span>
            </button>

            {invoicesOpen && (
              <>
                <button className="sidebar-item">
                  
                  <span>Proforma Invoices</span>
                </button>
                <button className="sidebar-item">
                
                  <span>Final Invoices</span>
                </button>
                <button className="sidebar-item">
                 
                  <span>Blocked</span>
                </button>
               
              </>
            )}
          </div>
          
        </nav>
      </aside>

      
      <div className="main-content">
        <div className="page-header">
          <Header />
          <div className="header-search">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
        </div>

        
        <div className="filters-row">
          <div className="filters-left">
            <button
              className="refresh-button"
              title="Refresh"
              onClick={() => {
                setSearch("");
                setFilters({
                  regions: [],
                  genders: [],
                  ageRange: "",
                  categories: [],
                  tags: [],
                  paymentMethods: [],
                  dateFrom: "",
                  dateTo: "",
                });
                setSort({ sortBy: "customerName", sortOrder: "asc" });
                setPage(1);
              }}
            >
              <span className="refresh-icon">
                <FiRefreshCw />
              </span>
            </button>
            <FilterPanel
              filters={filters}
              onChange={handleFiltersChange}
              tagOptions={tagOptions}
              categoryOptions={categoryOptions}
              paymentOptions={paymentOptions}
            />
          </div>
          <div className="filters-right">
            <SortingDropdown sort={sort} onChange={handleSortChange} />
            
          </div>
        </div>

        
        <SummaryCards summary={summary} />

        
        <div className="table-card">
          <TransactionsTable rows={rows} loading={loading} error={error} />
        </div>

        
        <div className="pagination-row">
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
