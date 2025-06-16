"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ChevronDown, Search } from "lucide-react"
import { format } from "date-fns"
import type { QuizAttempt, Quiz } from "@/lib/database-types"
import * as XLSX from "xlsx"

type ComprehensiveTableProps = {
  quizId: string
  quiz: Quiz
  attempts: QuizAttempt[]
}

export default function ComprehensiveTable({ quizId, quiz, attempts }: ComprehensiveTableProps) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // State for sorting
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // State for filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAttempts, setFilteredAttempts] = useState<QuizAttempt[]>(attempts)

  // Get question nodes from quiz flow
  const questionNodes =
    quiz.flow_data?.nodes?.filter(
      (node: any) => node.type === "optionQuestion" || node.type === "imageQuestion" || node.type === "textInput",
    ) || []

  // Get result nodes
  const resultNodes = quiz.flow_data?.nodes?.filter((node: any) => node.type === "result") || []

  // Update filtered attempts when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAttempts(attempts)
    } else {
      const filtered = attempts.filter((attempt) => {
        // Search in result titles
        if (attempt.result_node_id) {
          const resultNode = resultNodes.find((node: any) => node.id === attempt.result_node_id)
          if (resultNode && resultNode.data.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true
          }
        }

        // Search in answers
        if (attempt.answers) {
          for (const nodeId in attempt.answers) {
            const answer = attempt.answers[nodeId]
            if (typeof answer === "string" && answer.toLowerCase().includes(searchTerm.toLowerCase())) {
              return true
            }
          }
        }

        return false
      })
      setFilteredAttempts(filtered)
    }
  }, [searchTerm, attempts, resultNodes])

  // Sort attempts
  const sortedAttempts = [...filteredAttempts].sort((a, b) => {
    if (sortField === "created_at") {
      return sortDirection === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }

    // Sort by result
    if (sortField === "result") {
      const resultA = a.result_node_id ? getResultTitle(a.result_node_id) : ""
      const resultB = b.result_node_id ? getResultTitle(b.result_node_id) : ""
      return sortDirection === "asc" ? resultA.localeCompare(resultB) : resultB.localeCompare(resultA)
    }

    return 0
  })

  // Calculate pagination
  const totalPages = Math.ceil(sortedAttempts.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedAttempts.slice(indexOfFirstItem, indexOfLastItem)

  // Function to get result title by ID
  function getResultTitle(resultId: string) {
    const result = resultNodes.find((n: any) => n.id === resultId)
    return result ? result.data.title : "Unknown result"
  }

  // Function to get option text by ID or text input value
  function getAnswerText(nodeId: string, answerId: string) {
    const node = quiz.flow_data.nodes.find((n: any) => n.id === nodeId)
    if (!node) return "Unknown answer"

    if (node.type === "textInput") {
      return answerId || "No answer provided"
    }

    const option = node.data.options?.find((o: any) => o.id === answerId)
    return option ? option.text : "Unknown option"
  }

  // Function to handle sorting
  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Function to export data as CSV
  function exportToCSV() {
    // Create headers
    const headers = ["Date", "Result"]

    // Add question headers
    questionNodes.forEach((node) => {
      headers.push(node.data.title || `Question ${node.id.slice(0, 4)}`)
    })

    // Create rows
    const rows = sortedAttempts.map((attempt) => {
      const row: string[] = [
        format(new Date(attempt.created_at), "yyyy-MM-dd HH:mm:ss"),
        attempt.result_node_id ? getResultTitle(attempt.result_node_id) : "Incomplete",
      ]

      // Add answers
      questionNodes.forEach((node) => {
        const answer = attempt.answers?.[node.id]
        row.push(answer ? getAnswerText(node.id, answer) : "No answer")
      })

      return row
    })

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `quiz-responses-${quizId}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Function to export data as Excel
  function exportToExcel() {
    // Create headers
    const headers = ["Date", "Result"]

    // Add question headers
    questionNodes.forEach((node) => {
      headers.push(node.data.title || `Question ${node.id.slice(0, 4)}`)
    })

    // Create rows
    const rows = sortedAttempts.map((attempt) => {
      const row: any = {
        Date: format(new Date(attempt.created_at), "yyyy-MM-dd HH:mm:ss"),
        Result: attempt.result_node_id ? getResultTitle(attempt.result_node_id) : "Incomplete",
      }

      // Add answers
      questionNodes.forEach((node) => {
        const answer = attempt.answers?.[node.id]
        const questionTitle = node.data.title || `Question ${node.id.slice(0, 4)}`
        row[questionTitle] = answer ? getAnswerText(node.id, answer) : "No answer"
      })

      return row
    })

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows)

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Responses")

    // Generate Excel file and download
    XLSX.writeFile(workbook, `quiz-responses-${quizId}.xlsx`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Comprehensive Response Data</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search responses..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAttempts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No responses found. {searchTerm && "Try adjusting your search."}
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("created_at")}>
                      Date
                      {sortField === "created_at" && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("result")}>
                      Result
                      {sortField === "result" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </TableHead>
                    {questionNodes.map((node) => (
                      <TableHead key={node.id}>{node.data.title || `Question ${node.id.slice(0, 4)}`}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(attempt.created_at), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>
                        {attempt.result_node_id ? getResultTitle(attempt.result_node_id) : "Incomplete"}
                      </TableCell>
                      {questionNodes.map((node) => {
                        const answer = attempt.answers?.[node.id]
                        return (
                          <TableCell key={node.id}>{answer ? getAnswerText(node.id, answer) : "No answer"}</TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedAttempts.length)} of{" "}
                {sortedAttempts.length} entries
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum = currentPage - 2 + i
                    if (pageNum < 1) pageNum = i + 1
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i)
                    if (pageNum < 1 || pageNum > totalPages) return null

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink isActive={currentPage === pageNum} onClick={() => setCurrentPage(pageNum)}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Items per page:</span>
                <select
                  className="border rounded p-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1) // Reset to first page when changing items per page
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
