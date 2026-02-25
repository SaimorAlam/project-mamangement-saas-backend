import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChartName, ChartStatus, Prisma } from 'generated/prisma';
import { CreateChartBuildDto } from '../dto/create-chart-build.dto';

@Injectable()
export class ChartProgramBuilderService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createChartBuildDto: CreateChartBuildDto) {
        let subChat = {};
        const { title, status, category, programid, projectnumber, valueDiteacts, } = createChartBuildDto;

        const result = await this.prisma.$transaction(async (txPrisma) => {

            const mainChart = await txPrisma.chartTableProgramBuilder.create({
                data: {
                    title,
                    status,
                    category,
                    projectnumber,
                    programid,
                    valueDiteacts: {
                        create: valueDiteacts?.map((v) => ({
                            projectId: v.projectId,
                            rowname: v.rowname,
                            charttableId: v.charttableId


                        })),
                    },
                },
            });

            switch (category) {
                case ChartName.BAR: {
                    const {
                        numberOfDataset,
                        firstFieldDataset, lastFieldDataset,
                        widgets,
                    } = createChartBuildDto;

                    subChat = await txPrisma.barChartprogrambuilder.create({
                        data: {
                            ChartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFiledDataset: firstFieldDataset!,
                            lastFiledDAtaset: lastFieldDataset!,

                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#000000',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }
                case ChartName.HORIZONTAL_BAR: {
                    const {
                        numberOfDataset,
                        firstFieldDataset, lastFieldDataset,
                        widgets,
                    } = createChartBuildDto;

                    subChat = await txPrisma.horizontalBarChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,

                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#000000',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }
                case ChartName.PIE: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;
                    subChat = await txPrisma.piprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }

                case ChartName.HEATMAP: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.heatMapChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }
                case ChartName.AREA: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.areaChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }
                case ChartName.LINE: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.multiAxisChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }

                case ChartName.COLUMN: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.columnChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }
                case ChartName.HISTOGRAM: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.histogramChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }
                case ChartName.PARETO: {
                    const { numberOfDataset, widgets, Left_firstFieldDataset, Left_lastFieldDataset, Right_firstFieldDataset, Right_lastFieldDataset } = createChartBuildDto;

                    subChat = await txPrisma.paretoChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            Left_firstFieldDataset: Left_firstFieldDataset!,
                            Left_lastFieldDataset: Left_lastFieldDataset!,
                            Right_firstFieldDataset: Right_firstFieldDataset!,
                            Right_lastFieldDataset: Right_lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }

                case ChartName.FUNNEL: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.funnelChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });
                    break;
                }
                case ChartName.WATERFALL: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.waterFallChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });
                    break;
                }
                case ChartName.RADAR: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.radarChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });
                    break;
                }

                case ChartName.DOUGHNUT: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.doughnutChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });
                    break;
                }
                case ChartName.CANDLESTICK: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.candlestickChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });
                    break;
                }
                case ChartName.STACK_BAR_HORIZONTAL: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.stackedBarChartprogrambuilder.create({
                        data: {
                            ChartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFiledDataset: firstFieldDataset!,
                            lastFiledDAtaset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });
                    break;
                }

                case ChartName.GAUGE: {
                    const { widgets, startingRange, endRange, gaugeValue, chartHight, startAngle, endAngle, trackColor, strokeWidth, valueFontSize, shadeIntensity } = createChartBuildDto;

                    subChat = await txPrisma.solidGaugeChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            startingRange: startingRange!,
                            endRange: endRange!,
                            gaugeValue: gaugeValue!,
                            chartHight: chartHight!,
                            startAngle: startAngle!,
                            endAngle: endAngle!,
                            trackColor: trackColor!,
                            strokeWidth: strokeWidth!,
                            valueFontSize: valueFontSize!,
                            shadeIntensity: shadeIntensity!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }

                case ChartName.SCATTER: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.scatterChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                        color: widget.color ?? '#1cce0cff',
                                    })),
                                }
                                : undefined,
                        },
                    });
                    break;
                }

                default: {
                    throw new BadRequestException(
                        `Chart type "${status}" is not supported`,
                    );
                }
            }
            return { ...mainChart };
        });
        return result;
    }

    async findAllByProgram(programId: string) {
        const program = await this.prisma.program.findUnique({
            where: { id: programId },
        });

        if (!program) {
            throw new NotFoundException(`Program with ID ${programId} not found`);
        }

        const charts = await this.prisma.chartTableProgramBuilder.findMany({
            where: { programid: programId },
            include: {
                barChart: true,
                horizontalBarChart: true,
                pieChart: true,
                heatmapChart: true,
                areaChart: true,
                multiAxisChart: true,
                columnChart: true,
                stackedBarChart: true,
                doughnutChart: true,
                paretoChart: true,
                histogramChart: true,
                scatterChart: true,
                solidGaugeChart: true,
                funnelChart: true,
                waterFallChart: true,
                candlestickChart: true,
                radarChart: true,
                valueDiteacts: true,
                history: true,
            },
        });
        return {
            programId,
            charts: await Promise.all(charts.map(async chart => {
                const chartData =
                    chart.barChart ||
                    chart.horizontalBarChart ||
                    chart.pieChart ||
                    chart.heatmapChart ||
                    chart.areaChart ||
                    chart.multiAxisChart ||
                    chart.columnChart ||
                    chart.stackedBarChart ||
                    chart.doughnutChart ||
                    chart.paretoChart ||
                    chart.histogramChart ||
                    chart.scatterChart ||
                    chart.solidGaugeChart ||
                    chart.funnelChart ||
                    chart.waterFallChart ||
                    chart.candlestickChart ||
                    chart.radarChart;

                return {
                    id: chart.id,
                    title: chart.title,
                    category: chart.category,
                    status: chart.status,
                    chartData,
                    valueDetection: await this.detectChartValues(
                        chart.valueDiteacts
                    ),
                    history: chart.history,
                };
            })),
        };
    }

    async detectChartValues(
        valueDiteacts: { rowname: string, charttableId: string }[]
    ) {
        if (!Array.isArray(valueDiteacts)) return [];

        const results: any[] = [];

        for (const vd of valueDiteacts) {
            // Find the actual chart table record for the data (labels)
            console.log('Looking for chart table with ID:', vd.charttableId);
            const ct = await this.prisma.chartTable.findUnique({
                where: { id: vd.charttableId }
            });
            console.log(ct)
            if (!ct) continue;

            const extractRows = (axis: any): any[][] => {
                if (!axis) return [];
                let data = axis;
                if (typeof data === 'string') {
                    try { data = JSON.parse(data); } catch (e) { return []; }
                }
                if (data && typeof data === 'object' && Array.isArray(data.labels)) {
                    return data.labels;
                }
                if (Array.isArray(data)) return data;
                return [];
            };

            const allPossibleRows: any[][] = [
                ...extractRows(ct.xAxis),
                ...extractRows(ct.yAxis),
                ...extractRows(ct.zAxis),
            ];

            for (const row of allPossibleRows) {
                if (Array.isArray(row) && row.length > 0) {
                    const label = String(row[0]).trim();
                    const target = String(vd.rowname).trim();

                    console.log(label, target)
                    if (label.toLowerCase() === target.toLowerCase()) {
                        results.push({
                            rowname: vd.rowname,
                            matchedRow: row,
                            charttableId: vd.charttableId,
                        });
                        console.log(results)
                    }
                }
            }
        }

        const matching: any[][] = [];
        const seen = new Set<string>();

        for (const res of results) {
            const rowStr = JSON.stringify(res.matchedRow);
            if (!seen.has(rowStr)) {
                matching.push(res.matchedRow);
                seen.add(rowStr);
            }
        }

        return { matching };
    }
}
