"use client"
import React, { startTransition } from "react"
import { Search, Sliders, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import Link from "next/link"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { categories } from "@/lib/utils/organize-workshop"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "@/lib/hooks/debounce"

const getExactNameOfCategory = (str: string) => {
  let resultStr = ""
  categories.forEach((category) => {
    if (str === category.toLowerCase()) resultStr = category
  })
  return resultStr
}

export default function WorkshopNavbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedFilter, setSelectedFilter] = React.useState<string[]>([])
  const debouncedQuery = useDebounce(searchQuery)

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          categories: selectedFilter?.length
            ? selectedFilter.map((c) => c).join(".")
            : null,
        })}`
      )
    })
  }, [selectedFilter])

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          search: debouncedQuery.length ? debouncedQuery : null,
        })}`
      )
    })
  }, [debouncedQuery])

  return (
    <div className="wc-header bg-secondary">
      <div className="header-container">
        <div className="header-up">
          <div className="hu-logo text-3xl lg:text-4xl font-archivo">
            <Link href="/">HiGrow.</Link>
          </div>
          <div className="xl:max-w-3xl w-full hidden lg:block">
            <div className="hu-search flex items-center border ml-4 border-black px-5 bg-background rounded-sm">
              <Search className="h-4 w-4 md:h-5 md:w-5 shrink-0 opacity-50" />
              <Input
                className="flex w-full rounded-sm  bg-transparent py-3 text-base focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                placeholder="Search for Workshops"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {debouncedQuery && (
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3 md:h-4 md:w-4 shrink-0 opacity-50" />
                </Button>
              )}
            </div>
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                className="px-2 h-9 rounded-full md:h-12 md:px-6 shrink-0 text-xs md:text-sm"
                variant={"outline"}
                role="combobox"
                aria-expanded={open}
              >
                Filters
                <Sliders className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      onSelect={(currentValue) => {
                        const capitalizedString =
                          getExactNameOfCategory(currentValue)

                        if (!selectedFilter.includes(capitalizedString))
                          setSelectedFilter([
                            ...selectedFilter,
                            capitalizedString,
                          ])
                        setOpen(false)
                      }}
                    >
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="w-full lg:hidden mt-6">
          <div className="hu-search flex items-center border-b px-6 bg-background rounded-md">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-base focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              placeholder="Search for Workshops"
            />
          </div>
        </div>
        {selectedFilter.length > 0 && (
          <div className="mt-14 space-y-4">
            <h2 className="text-2xl text-primary-foreground">
              Selected Categories
            </h2>
            <div className="flex items-center space-x-3 text-primary-foreground">
              {selectedFilter.map((category) => (
                <Button
                  key={category}
                  variant={"outline"}
                  className="rounded-full bg-secondary border-background px-4"
                  onClick={() => {
                    const updatedfilters = selectedFilter.filter(
                      (cat) => cat !== category
                    )
                    setSelectedFilter(updatedfilters)
                  }}
                >
                  {category.toUpperCase()}
                  <X className="ml-2 w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
